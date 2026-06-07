# Togo AgriVision 🌾📱

> **Solution IA & NLP pour l'inclusion linguistique et la résilience agricole au Togo.**
> Développé avec passion par l'équipe **Smart_Tech** (Thématique : **AgriTech**).

---

## 💡 1. Problématique & Vision d'Impact

Dans les zones rurales au Togo (comme à Tabligbo ou Tsévié), les petits producteurs font face à deux obstacles majeurs :
1. **Destruction des cultures :** Les maladies des plantes (comme la rouille commune du maïs ou la mosaïque de la tomate) déciment les récoltes par manque de diagnostic précoce et d'accès à des experts agronomes.
2. **Exclusion linguistique :** 90 % des guides scientifiques et des recommandations de traitements curatifs/préventifs sont rédigés exclusivement en français. Cela crée une barrière critique pour les producteurs locaux qui s'expriment et comprennent mieux leurs langues nationales.

**Notre objectif :** Démocratiser l'accès au conseil agricole grâce à une application mobile connectée à une IA hybride, capable de diagnostiquer instantanément une pathologie végétale à partir d'une photo et de fournir des remèdes automatisés **entièrement traduits en Éwé**.

---

## 🛠️ 2. Ce que nous avons réalisé (Réalisations Techniques)

Nous avons conçu et déployé une architecture backend robuste structurée autour de **FastAPI** et de deux briques d'Intelligence Artificielle de pointe :

### A. Composant Vision par Ordinateur (Classification des maladies)
* **Modèle :** Architecture **MobileNetV2** (via TensorFlow/Keras), choisie pour sa légèreté et son adéquation avec les contraintes des serveurs cloud ou des environnements embarqués.
* **Dataset :** Entraînement rigoureux sur un dataset d'envergure comprenant **54 305 images** couvrant **38 classes de maladies** et de cultures saines.
* **Performance :** Le modèle a atteint un score de validation exceptionnel de **93,85 % d'accuracy**, garantissant la fiabilité des diagnostics en conditions réelles.

### B. Composant NLP (Génération et Traduction en Langue Locale)
* **Modèle :** Intégration du modèle étendu **NLLB-200 (No Language Left Behind)** de Meta AI, spécialement conçu pour la prise en charge des langues peu dotées comme l'Éwé (`ewe_Latn`).
* **Optimisation Hybride (Anti-Hallucination) :** Pour pallier les limites des modèles de langage mondiaux face au jargon technique agronomique, nous avons développé un algorithme de secours (fallback). L'API combine un dictionnaire local validé pour les noms de pathologies complexes (ex: *Rouille commune du Maïs* devient instantanément *Abati ƒe dɔlékle*) avec la puissance générative de Meta pour la traduction fluide des longs textes de traitements préventifs et curatifs.

### C. Architecture API (FastAPI) & Intégration Mobile
* Création d'un endpoint `POST /predict` acceptant les requêtes `multipart/form-data` (fichiers images).
* Gestion native des politiques de partage de ressources **CORS** pour permettre une communication sécurisée et fluide avec notre interface mobile **React Native** (composée de ses 4 écrans : Accueil, Diagnostic/Caméra, Historique, et Détails).
* Nettoyage et optimisation de l'indexation Git (exclusion des fichiers lourds `.h5` et du cache Hugging Face via un fichier `.gitignore` strict pour conserver un dépôt de code source léger et collaboratif).

---

## 📈 3. Ce que nous prévoyons de faire (Feuille de Route & Perspectives)

Pour propulser **Togo AgriVision** au niveau supérieur après ce hackathon, notre feuille de route se décline en trois axes majeurs :

### 🚀 Phase 1 : Extension Linguistique et Agronomique (Court Terme)
* **Intégration du Kabyè :** Déployer la même technologie de traduction NLP pour le Kabyè afin de couvrir les producteurs des régions du nord du Togo (Kara).
* **Enrichissement du Dataset :** Collecter des images directement sur le terrain togolais pour adapter le modèle de vision aux spécificités visuelles des sols et micro-climats locaux.

### 🔊 Phase 2 : Accessibilité Vocale par Synthèse Vocale (Moyen Terme)
* **Intégration du Text-To-Speech (TTS) :** Pour inclure les producteurs touchés par l'analphabétisme, nous prévoyons d'ajouter une fonctionnalité de lecture audio des remèdes en Éwé et en Kabyè. L'agriculteur n'aura qu'à appuyer sur un bouton "Haut-parleur" pour écouter les conseils dictés à voix haute par une IA vocale.

### 📡 Phase 3 : Mode Hors-Ligne & Edge AI (Long Terme)
* **Quantification du modèle (TFLite) :** Compresser notre modèle MobileNetV2 pour qu'il puisse être directement embarqué localement à l'intérieur de l'application React Native.
* **Diagnostic sans connexion :** Permettre à l'agriculteur d'obtenir son diagnostic visuel même au fond de son champ sans aucune couverture réseau Internet (Edge AI), la synchronisation des données et des traductions complexes se faisant dès le retour à une zone connectée.

---

## 💻 4. Structure du Projet Backend

```text
backend-ai/
├── app/
│   └── main.py             # Code principal de l'API FastAPI et logique de traduction
├── model/
│   ├── classes.json        # Liste des 38 pathologies végétales indexées
│   └── remedes.json        # Base de données francophone des traitements curatifs/préventifs
├── .gitignore              # Fichier d'exclusion pour le cache IA et les fichiers .h5 lourds
├── README.md               # Documentation du projet
└── requirements.txt        # Dépendances Python (TensorFlow, FastAPI, Transformers, etc.)



\## 👥 Membres de l'Équipe (Smart Tech)

* \*\*MEDANNOU Brice Josué\*\* Chef d'équipe 
* \*\* KASSEGNIN Narcisse\*\* 
* \*\*LADZEKPO Espoir\*\*
* \*\*BANDJOUNI Moni\*\*

