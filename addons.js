import Game from './player_creation.js';

export function enableNarrativeLinks() {
    const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
    narrativeLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    });
    document.getElementById('meal-interface').remove();
}

export function readJSON(namefile) {
    let player = null;
    let saveData = localStorage.getItem(namefile);
    if (saveData) {
        player = JSON.parse(saveData);    
    }
    return player;
}

// function saveToFile(data, filename) {
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// }


function saveJSON(namefile, player) {
    localStorage.setItem(namefile, JSON.stringify(player));
    Game.saveToFile(player, "player_autosave.json");
}

class Addons {
    static GOLD_MAX = 50;
    static RESOURCE_MAX = 8;

    static gainGold(player, amount) {
        player.bag.gold += amount;
        if (player.bag.gold > Addons.GOLD_MAX) {
            player.bag.gold = Addons.GOLD_MAX;
            return "[Gold limit reached !]";
        }
        return null;
    }

    static eat(player, choice) {
        if (player.disciplines[Game.Disciplines.HUNTING]) {
            return "[No need to eat, you have the Hunter discipline !]";
        } 
        if (choice == true) {
            if (player.bag.meals > 0) {
                player.bag.meals--;
                saveJSON("player_autosave", player);
                return "[-1 Food]";
            }
        } else {
            player.endurance -= 3;
            saveJSON("player_autosave", player);
            return "[-3 Endurance]";
        }
    }

    static heal(player) {
        if (player.combat) {
            return "You can't heal during a fight !";
        }
        
        if (player.endurance === player.enduranceMax) {
            return "Endurance is at maximum !";
        }
        
        if (player.bag.potionsHealing > 0) {
            player.bag.potionsHealing--;
            player.endurance = Math.min(player.endurance + 4, player.enduranceMax);
            
            if (player.endurance === player.enduranceMax) {
                return "Endurance is at maximum !";
            }
            return null;
        }
        return "Not enough Potions !";
    }
}

export default Addons;

export function importPlayer() {
    // return new Promise((resolve, reject) => {
    //     const fileInput = document.createElement('input');
    //     fileInput.type = 'file';
    //     fileInput.accept = '.json';
    //     fileInput.style.display = 'none';
    //     document.body.appendChild(fileInput);

    //     fileInput.onchange = (event) => {
    //         const file = event.target.files[0];
    //         if (!file) {
    //             reject("Aucun fichier sélectionné");
    //             return;
    //         }

    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             try {
    //                 const player = JSON.parse(e.target.result);
    //                 saveJSON("player_autosave", player);
    //                 resolve(player);
    //             } catch (error) {
    //                 reject("Erreur de parsing JSON");
    //             }
    //             document.body.removeChild(fileInput);
    //         };
    //         reader.onerror = () => {
    //             reject("Erreur de lecture");
    //             document.body.removeChild(fileInput);
    //         };
    //         reader.readAsText(file);
    //     };

    //     fileInput.click();
    // });

    const elements = document.querySelectorAll('[class^="sect"]');
    const newinput = document.createElement('input');
    const newbutton = document.createElement('button');

    newinput.id = 'jsonFile';
    newinput.type = '.json';
    newinput.setAttribute('.json');

    newbutton.
}

function checkForMealChoice() {
    const paragraphs = document.querySelectorAll('p');
    let hasMealChoice = false;
    let mealParagraph = null;

    // Recherche du paragraphe contenant le choix de repas
    paragraphs.forEach(p => {
        const text = p.textContent.toLowerCase();
        if (text.includes('eat') && text.includes('meal') && text.includes('endurance')) {
            hasMealChoice = true;
            mealParagraph = p;
        }
    });

    if (hasMealChoice && mealParagraph) {
        // Création de l'interface de repas
        const mealInterface = document.createElement('div');
        mealInterface.id = 'meal-interface';
        mealInterface.innerHTML = `
            <button id="eat-meal">EAT</button>
            <button id="skip-meal">SKIP</button>
            <input type="file" id="player-import" accept=".json" style="display: none;">
        `;

        // Insertion de l'interface dans le DOM
        const parent = mealParagraph.parentElement;
        if (parent) {
            let nextSibling = mealParagraph.nextElementSibling;
            let inserted = false;
            
            // Recherche du prochain lien narratif pour positionnement
            while (nextSibling && !inserted) {
                if (nextSibling.querySelector('a[href*="sect"]')) {
                    parent.insertBefore(mealInterface, nextSibling);
                    inserted = true;
                }
                nextSibling = nextSibling.nextElementSibling;
            }
            
            // Insertion à la fin si aucun lien trouvé
            if (!inserted) {
                parent.appendChild(mealInterface);
            }
        }

        // Désactivation des liens narratifs
        const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
        narrativeLinks.forEach(link => {
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        });

        // Ajout des écouteurs d'événements avec vérification
        setTimeout(() => {
            const eatBtn = document.getElementById('eat-meal');
            const skipBtn = document.getElementById('skip-meal');
            
            if (eatBtn) eatBtn.addEventListener('click', handleEatMeal);
            if (skipBtn) skipBtn.addEventListener('click', handleSkipMeal);
        }, 100);
    }

    return hasMealChoice;
}

async function handleEatMeal() {
    try {
        let player = readJSON("player_autosave");
        if (!player) {
            player = await importPlayer();
        }
        Addons.eat(player, true);
        enableNarrativeLinks();
    } catch (error) {
        console.error("Meal error:", error);
    }
}

async function handleSkipMeal() {
    try {
        let player = readJSON("player_autosave");
        if (!player) {
            player = await importPlayer();
        }
        Addons.eat(player, false);
        enableNarrativeLinks();
    } catch (error) {
        console.error("Meal error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkForMealChoice() ;
});
