from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import numpy as np
import tensorflow as tf
import uvicorn

app = FastAPI(
    title="Togo AgriVision API",
    description="API de diagnostic par Intelligence Artificielle des maladies des cultures au Togo",
    version="1.0.0"
)

# Configuration du CORS pour permettre à l'application mobile de communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En développement, on autorise toutes les connexions
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# CONFIGURATION DE L'IA (PÔLE IA)
# ==========================================
# TODO: Dès que notre modèle est prêt, placez-le dans backend-ai/model/model_agrivision.h5
# et décommentez la ligne ci-dessous pour le charger au démarrage du serveur.
# MODEL = tf.keras.models.load_model("model/model_agrivision.h5")

# Liste ordonnée des classes (à adapter selon les étiquettes de votre Dataset Kaggle)
CLASSES = ["Manioc_Sain", "Mosaique_Manioc", "Strie_Brune_Manioc", "Mais_Sain", "Rouille_Mais"]


@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Bienvenue sur l'API Togo AgriVision. Le serveur IA sous Python 3.11 est opérationnel."
    }


@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    try:
        # 1. Lecture du fichier image envoyé par le smartphone
        contents = await file.read()
        
        # 2. Prétraitement de l'image (Pillow & NumPy)
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224))  # Taille standard pour la plupart des CNN (MobileNet, ResNet)
        
        img_array = np.array(image) / 255.0  # Normalisation [0, 1]
        img_array = np.expand_dims(img_array, axis=0)  # Ajout de la dimension de batch (1, 224, 224, 3)

        # 3. Exécution de la prédiction
        # ------------------------------------------
        # MODE SIMULATION (Par défaut pour le pôle Frontend)
        # ------------------------------------------
        mock_prediction = {
            "culture": "Manioc",
            "maladie": "Mosaïque du Manioc",
            "confiance": 0.954,
            "remede": (
                "Arracher et brûler immédiatement les plants infectés pour stopper la propagation. "
                "Pour les prochaines saisons, utilisez des boutures saines et certifiées résistantes "
                "distribuées par les services agronomiques locaux au Togo."
            )
        }
        
        # ------------------------------------------
        # VRAIE IA (Décommentez ce bloc une fois le modèle chargé)
        # ------------------------------------------
        """
        predictions = MODEL.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        nom_classe = CLASSES[predicted_class_index]
        
        # Exemple de dictionnaire pour lier la classe aux remèdes locaux
        # À enrichir avec vos recherches en agronomie
        return {
            "culture": nom_classe.split("_")[0],
            "maladie": nom_classe.replace("_", " "),
            "confiance": confidence,
            "remede": "Remède agronomique correspondant à la maladie détectée."
        }
        """

        return mock_prediction

    except Exception as e:
        return {"error": f"Une erreur est survenue lors de l'analyse : {str(e)}"}


if __name__ == "__main__":
    # Lancement du serveur sur le port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
