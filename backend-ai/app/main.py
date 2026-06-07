from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os
import numpy as np
import tensorflow as tf
import uvicorn
import json 
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = FastAPI(
    title="Togo AgriVision API",
    description="API de diagnostic par Intelligence Artificielle et traduction en langues locales au Togo",
    version="1.1.0"
)

# Configuration du CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# GESTION DES CHEMINS ABSOLUS (SÉCURITÉ)
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(BASE_DIR)

CHEMIN_DOSSIER_MODEL = os.path.join(BACKEND_DIR, "model")
MODEL_PATH = os.path.join(CHEMIN_DOSSIER_MODEL, "model_agrivision.h5")
CLASSES_PATH = os.path.join(CHEMIN_DOSSIER_MODEL, "classes.json")
REMEDES_PATH = os.path.join(CHEMIN_DOSSIER_MODEL, "remedes.json")

# On crée un dossier spécifique pour les modèles NLP à l'intérieur de ton projet
DOSSIER_CACHE_HF = os.path.join(CHEMIN_DOSSIER_MODEL, "huggingface_cache")
os.makedirs(DOSSIER_CACHE_HF, exist_ok=True)

# On force l'environnement à utiliser ce dossier local pour le téléchargement
os.environ["HF_HOME"] = DOSSIER_CACHE_HF
os.environ["TRANSFORMERS_CACHE"] = DOSSIER_CACHE_HF

# ==========================================
# CONFIGURATION ET CHARGEMENT DES MODÈLES (IA)
# ==========================================
print(f"-> Chargement du modèle Vision depuis : {MODEL_PATH}")
MODEL = tf.keras.models.load_model(MODEL_PATH)

print(f"-> Chargement des classes depuis : {CLASSES_PATH}")
with open(CLASSES_PATH, "r", encoding="utf-8") as f:
    CLASSES = json.load(f)

print(f"-> Chargement des remèdes depuis : {REMEDES_PATH}")
if os.path.exists(REMEDES_PATH):
    with open(REMEDES_PATH, "r", encoding="utf-8") as f:
        DICTIONNAIRE_REMEDES = json.load(f)
else:
    DICTIONNAIRE_REMEDES = {}

# Initialisation du traducteur automatique NLP (Meta NLLB-200)
print("-> Initialisation du traducteur IA Éwé (Meta NLLB via AutoModel)...")
try:
    NOM_MODELE = "facebook/nllb-200-distilled-600M"
# Chargement du Tokenizer et du Modèle avec le cache local imposé

    TOKENIZER_NLP = AutoTokenizer.from_pretrained(NOM_MODELE, cache_dir=DOSSIER_CACHE_HF)
    MODELE_NLP = AutoModelForSeq2SeqLM.from_pretrained(NOM_MODELE, cache_dir=DOSSIER_CACHE_HF)

    TRADUCTEUR_ACTIF = True
    print("Traducteur IA chargé avec succès dans le cache local. Prêt pour les traductions en Éwé !")
except Exception as e:
    print(f"⚠️ Impossible de charger le traducteur NLP : {str(e)}. Mode secours activé.")
    TRADUCTEUR_ACTIF = False

DICTIONNAIRE_SECOURS_EWE = {
    "Rouille commune du Maïs": "Abati ƒe dɔlékle (Fafa)",
    "Gale bactérienne de la tomate": "Tomati ƒe dɔlékle si wɔna ɣi",
    "Mosaïque de la tomate": "Tomati dɔléle si gblẽna amãwo",
    "Mildiou de la pomme de terre": "Potato ƒe amã gbegblẽ dɔ",
    "Maïs Sain (Pas de maladie)": "Maïs si le laza (Dɔwɔnu aɖeke mele eme o)"
}

def traduire_en_ewe(texte_francais: str) -> str:
    """Fonction qui traduit un texte du Français vers l'Éwé en utilisant l'IA"""
    if not TRADUCTEUR_ACTIF or not texte_francais:
        return "Traductions en cours de synchronisation..."

# ÉTAPE 1 : On vérifie si on a une traduction humaine exacte dans notre dictionnaire de secours
    if texte_francais in DICTIONNAIRE_SECOURS_EWE:
        return DICTIONNAIRE_SECOURS_EWE[texte_francais]

    try:
        # Préparation des langues : source = Français, cible = Éwé
        inputs = TOKENIZER_NLP(texte_francais, return_tensors="pt")
# Version moderne et compatible pour forcer la langue cible (Éwé)
        target_lang_id = TOKENIZER_NLP.convert_tokens_to_ids("ewe_Latn")
        # On force la génération vers le token de la langue Éwé (ewe_Latn)
        # forced_bos_token_id = TOKENIZER_NLP.lang_code_to_id["ewe_Latn"]
        
        outputs = MODELE_NLP.generate(
            **inputs, 
            forced_bos_token_id=target_lang_id, 
            max_length=256,
        )
        
        # Décodage du résultat textuel
        texte_traduit = TOKENIZER_NLP.decode(outputs[0], skip_special_tokens=True)
        return texte_traduit
    except Exception:
        return "Dɔlékle tsitsia ƒe kpekpeɖeŋu"

# ==========================================
# ROUTES API
# ==========================================
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Bienvenue sur l'API Togo AgriVision. Les modules Vision et NLP sont opérationnels."
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    try:
        # 1. Lecture du fichier image
        contents = await file.read()
        
        # 2. Prétraitement de l'image
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224))
        
        img_array = np.array(image, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # 3. Exécution de la prédiction Vision
        predictions = MODEL.predict(img_array)
        predicted_class_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        
        # 4. Extraction de la classe
        nom_classe = None
        if isinstance(CLASSES, list):
            if predicted_class_index < len(CLASSES):
                nom_classe = CLASSES[predicted_class_index]
        elif isinstance(CLASSES, dict):
            if str(predicted_class_index) in CLASSES:
                nom_classe = CLASSES[str(predicted_class_index)]
            elif predicted_class_index in CLASSES:
                nom_classe = CLASSES[predicted_class_index]

        if not nom_classe:
            nom_classe = "Default"

        # 5. Extraction de la culture et de la maladie
        part = nom_classe.split("_")
        culture = part[0] if len(part) > 0 else "Inconnu"
        maladie_brute = part[1] if len(part) > 1 else nom_classe 

        # 6. Récupération des remèdes en Français
        infos_maladie = DICTIONNAIRE_REMEDES.get(
            nom_classe, 
            DICTIONNAIRE_REMEDES.get(
                "Default", 
                {
                    "nom_fr": maladie_brute.replace("-", " ").replace("_", " "),
                    "description": "Diagnostic effectué par l'IA.",
                    "preventif": "Pratiques de nettoyage de parcelles recommandées.",
                    "curatif": "Consulter un conseiller ou l'agent agricole de votre zone au Togo."
                }
            )
        )

        # 7. TRADUCTION IA EN TEMPS RÉEL (NLP)
        # On traduit le traitement curatif et préventif en Éwé à la volée !
        nom_maladie_fr = infos_maladie["nom_fr"]
        remede_curatif_fr = infos_maladie["curatif"]
        remede_preventif_fr = infos_maladie["preventif"]
        
        nom_maladie_ewe = traduire_en_ewe(nom_maladie_fr)
        remede_curatif_ewe = traduire_en_ewe(remede_curatif_fr)
        remede_preventif_ewe = traduire_en_ewe(remede_preventif_fr)

        return {
            "status": "success",
            "culture": culture,
            "maladie_code": nom_classe,
            "nom_francais": infos_maladie["nom_fr"],
            "confiance": round(confidence * 100, 2),
            "details": {
                "description": infos_maladie["description"],
                "traitement_preventif": remede_preventif_fr,
                "traitement_curatif": remede_curatif_fr
            },
            "langues_locales": {
                "ewe": {
                    "nom_local": nom_maladie_ewe,
                    "traitement_preventif": remede_preventif_ewe,
                    "traitement_curatif": remede_curatif_ewe
                }
            }
        } 

    except Exception as e:
        return {"status": "error", "error": f"Une erreur est survenue lors de l'analyse : {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)