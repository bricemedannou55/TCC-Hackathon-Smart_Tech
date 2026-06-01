from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Bienvenue sur l'API Togo AgriVision. Le serveur IA est opérationnel."
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    try:
        # 1. Lecture du fichier image envoyé par le mobile
        contents = await file.read()
        
        # TODO: Pôle IA - Intégrer ici le chargement du modèle TensorFlow (.h5/.keras)
        # et le prétraitement de l'image (resize, normalize) avant la prédiction.
        
        # 2. Simulation de la réponse IA (En attendant l'intégration du modèle final)
        # Cela permet au pôle Frontend de travailler en parallèle sans être bloqué.
        mock_prediction = {
            "culture": "Manioc",
            "maladie": "Mosaïque du Manioc",
            "confiance": 0.95,
            "remede": (
                "Arracher et brûler immédiatement les plants infectés pour stopper la propagation. "
                "Pour les prochaines saisons, utilisez des boutures saines et certifiées résistantes "
                "distribuées par les services agronomiques locaux."
            )
        }
        
        return mock_prediction

    except Exception as e:
        return {"error": f"Une erreur est survenue lors de l'analyse : {str(e)}"}

if __name__ == "__main__":
    # Lancement du serveur sur le port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)