\# TCC-Hackathon-Smart\_tech : Togo AgriVision



\*\*Togo AgriVision\*\* est une solution technologique innovante conçue pour soutenir les petits agriculteurs togolais face aux ravages des maladies des cultures. En s'appuyant sur l'Intelligence Artificielle (Deep Learning), notre application mobile permet de diagnostiquer instantanément les pathologies des plantes (telles que le manioc ou le maïs) à partir d'une simple photo. 



Ce projet est développé dans le cadre du TCC Hackathon (Phase 1) par notre équipe de 4 étudiants spécialisés en informatique et IA.



\---



\## 🎯 Problématique \& Approche de Solution



\### La Problématique

Au Togo, les maladies des cultures minent considérablement le rendement des petits agriculteurs. Ces derniers se retrouvent souvent exclus des solutions numériques mondiales existantes en raison de deux obstacles majeurs sur le terrain :

1\. \*\*La fracture réseau\*\* en zone rurale (accès Internet limité ou inexistant dans les champs).

2\. \*\*La barrière de l'analphabétisme\*\* et de la langue, rendant les interfaces textuelles classiques inutilisables.



\### Notre Solution (MVP En Ligne)

Pour résoudre ce problème de manière réaliste et efficace, nous développons un produit minimum viable (MVP) basé sur une architecture connectée :

\* \*\*Application Mobile Native (Frontend) :\*\* Développée avec React Native et Expo, offrant une interface ultra-simplifiée et visuelle. L'agriculteur capture une photo de la feuille malade et l'envoie au système.

\* \*\*Serveur d'Intelligence Artificielle (Backend) :\*\* Un serveur Python propulsé par \*\*FastAPI\*\* qui charge notre modèle de Deep Learning (TensorFlow/Keras). Il analyse les caractéristiques de l'image reçue et retourne instantanément le diagnostic accompagné de remèdes agro-écologiques et de bio-pesticides locaux.



\---



\## 🗺️ Feuille de Route Future (Roadmap Post-Compétition)

Conscients des réalités physiques et culturelles du monde rural togolais, notre objectif après la compétition est de faire évoluer ce MVP vers une solution totalement souveraine et déconnectée :

\* 📦 \*\*Mode Hors-Ligne Intégral (Edge AI) :\*\* Compression du modèle au format \*\*TensorFlow Lite\*\* pour l'intégrer directement au sein du smartphone, éliminant ainsi complètement le besoin d'une connexion Internet.

\* 🗣️ \*\*Assistance Vocale Modulaire :\*\* Intégration d'une synthèse vocale en langues locales (\*\*Éwé\*\* et \*\*Kabyè\*\*) pour dicter oralement les traitements, brisant définitivement la barrière de l'analphabétisme.



\---



\## 🏗️ Architecture du Projet



Le dépôt est structuré sous forme de Monorepo pour permettre un développement parallèle et propre :



\* `backend-ai/` : Contient l'API FastAPI, les scripts d'entraînement du modèle TensorFlow, et le stockage des fichiers de classification.

\* `mobile-app/` : Contient l'application mobile multiplateforme développée avec React Native et Expo Workflow.



\---



\## 👥 Membres de l'Équipe (Smart Tech)

* \*\*MEDANNOU Brice Josué\*\* Chef d'équipe 
* \*\* KASSEGNIN Narcisse\*\* 
* \*\*LADZEKPO Espoir\*\*
* \*\*BANDJOUNI Moni\*\*

