# Projet Fin Année

## Structure du projet

- `/*.c` : Code source principal en C
- `export/` : Fichiers CSS, JS et HTML
- `Makefile` : Automatisation de la compilation
- `ressources/` : Fichier Data
- `/README.md` : Ce fichier

## Utilisation

1. **Compiler le projet**
    - `make` : compile le projet 
    - `make web` : supprime tout les fichiers HTML (s'ils existent) et execute l'algo
    - `make hsup` : supprime tout les fichiers HTML (s'ils existent)

2. **Modification Importante**
    - Modifier le path dans la fonction `updateServerWithPlayerData()` dans `Addons.js`
    - Vous avez : `C:\\Users\\matth\\Downloads\\player_autosave.json`
    - Modifier par : `C:\\Users\\<Nom Utilisateur>\\Downloads\\player_autosave.json`
    - (Si vous n'êtes pas sur windows ou si vous utilisez un repertoire différent de Téléchargement rentrer : `<votre path>\\player_autosave.json`)

3. **Lancer le programme**
    - `./projet.exe --file <nom fichier>` : genere les pages html
    - `node server.js` : lance le server `http://localhost:3000/` pour la modification du json

## Auteurs

- Matthieu BALLOUT
- Ethan COCHARD
- Lia ZADOROZNYJ