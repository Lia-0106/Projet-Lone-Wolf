// ==== FONCTIONS D'INTERFACE UTILISATEUR ====
let player = null;
let disciplinesChosen = 0;
const MAX_DISCIPLINES = 6;

// -------------------------------------------------------------------

// ==== FONCTIONS UTILES ====

function updateDisplay(message) {
    const output = document.getElementById("game-output");
    output.innerText += message + "\n";
    output.scrollTop = output.scrollHeight;
}

function showStep(stepId) {
    ["step-name", "step-weapon", "step-disciplines"].forEach(id => {
        document.getElementById(id).style.display = (id === stepId) ? "block" : "none";
    });
}

function showSectionLoaded() {
    ["step-name", "step-weapon", "step-disciplines", "next-step"].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = "none";
    });
    
    const gameContent = document.getElementById("game-content");
    if(gameContent) gameContent.style.display = "block";
}

// -------------------------------------------------------------------

// ==== INITIALISATION ====
document.addEventListener("DOMContentLoaded", function() {
    showStep("step-name");
    document.getElementById("next-step").addEventListener("click", nextStep);
});

// -------------------------------------------------------------------

// ==== CLASSE GAME ====
class Game {
    static WEAPON_MAX = 2;
    static RESOURCE_MAX = 8;
    static GOLD_MAX = 50;

    static Disciplines = {
        CAMOUFLAGE: 0,
        HUNTING: 1,
        SIXTH_SENSE: 2,
        TRACKING: 3,
        WEAPONSKILL: 4,
        HEALING: 5,
        MINDSHIELD: 6,
        MINDBLAST: 7,
        ANIMAL_KINSHIP: 8,
        MIND_OVER_MATTER: 9
    };

    static Weapons = {
        DAGGER: 0,
        SPEAR: 1,
        MACE: 2,
        SHORT_SWORD: 3,
        WARHAMMER: 4,
        SWORD: 5,
        AXE: 6,
        QUARTERSTAFF: 7,
        BROADSWORD: 8,
        BOW: 9
    };

    static SpecialItems = {
        TICKET: 0,
        SEAL_OF_HAMMERDAL: 1,
        MAGIC_SPEAR: 2,
        CRYSTAL_STAR_PENDANT: 3,
        RED_PASS: 4,
        WHITE_PASS: 5,
        DOCUMENTS: 6
    };

static combatTable = [
    // Format: [RC, RandomNumber, PlayerDamage, EnemyDamage]
    [-11, 0, 0, 11], [-11, 1, 0, 10], [-11, 2, 0, 10], [-11, 3, 0, 9],
    [-11, 4, 0, 8], [-11, 5, 1, 8], [-11, 6, 1, 7], [-11, 7, 2, 6],
    [-11, 8, 3, 5], [-11, 9, 4, 5], [-10, 0, 0, 10], [-10, 1, 0, 10],
    [-10, 2, 0, 9], [-10, 3, 0, 9], [-10, 4, 1, 8], [-10, 5, 1, 7],
    [-10, 6, 2, 6], [-10, 7, 3, 6], [-10, 8, 4, 5], [-10, 9, 5, 4],
    [-9, 0, 0, 10], [-9, 1, 0, 9], [-9, 2, 0, 9], [-9, 3, 1, 8],
    [-9, 4, 1, 7], [-9, 5, 2, 7], [-9, 6, 3, 6], [-9, 7, 4, 5],
    [-9, 8, 5, 4], [-9, 9, 6, 3], [-8, 0, 0, 9], [-8, 1, 0, 9],
    [-8, 2, 1, 8], [-8, 3, 2, 7], [-8, 4, 2, 6], [-8, 5, 3, 6],
    [-8, 6, 4, 5], [-8, 7, 5, 4], [-8, 8, 6, 3], [-8, 9, 7, 2],
    [-7, 0, 0, 9], [-7, 1, 1, 8], [-7, 2, 2, 7], [-7, 3, 3, 6],
    [-7, 4, 3, 6], [-7, 5, 4, 5], [-7, 6, 5, 4], [-7, 7, 6, 3],
    [-7, 8, 7, 2], [-7, 9, 8, 1], [-6, 0, 1, 8], [-6, 1, 2, 7],
    [-6, 2, 3, 6], [-6, 3, 4, 5], [-6, 4, 5, 5], [-6, 5, 6, 4],
    [-6, 6, 7, 3], [-6, 7, 8, 2], [-6, 8, 9, 2], [-6, 9, 10, 1],
    [-5, 0, 2, 7], [-5, 1, 3, 6], [-5, 2, 4, 5], [-5, 3, 5, 4],
    [-5, 4, 6, 4], [-5, 5, 7, 3], [-5, 6, 8, 2], [-5, 7, 9, 2],
    [-5, 8, 10, 1], [-5, 9, 11, 0], [-4, 0, 3, 6], [-4, 1, 4, 5],
    [-4, 2, 5, 4], [-4, 3, 6, 4], [-4, 4, 7, 3], [-4, 5, 8, 2],
    [-4, 6, 9, 2], [-4, 7, 10, 1], [-4, 8, 11, 0], [-4, 9, 12, 0],
    [-3, 0, 4, 5], [-3, 1, 5, 4], [-3, 2, 6, 3], [-3, 3, 7, 3],
    [-3, 4, 8, 2], [-3, 5, 9, 2], [-3, 6, 10, 1], [-3, 7, 11, 0],
    [-3, 8, 12, 0], [-3, 9, 14, 0], [-2, 0, 5, 4], [-2, 1, 6, 3],
    [-2, 2, 7, 3], [-2, 3, 8, 2], [-2, 4, 9, 2], [-2, 5, 10, 1],
    [-2, 6, 11, 0], [-2, 7, 13, 0], [-2, 8, 14, 0], [-2, 9, 16, 0],
    [-1, 0, 6, 3], [-1, 1, 7, 2], [-1, 2, 8, 2], [-1, 3, 9, 2],
    [-1, 4, 10, 1], [-1, 5, 11, 0], [-1, 6, 13, 0], [-1, 7, 14, 0],
    [-1, 8, 16, 0], [-1, 9, 18, 0], [0, 0, 7, 2], [0, 1, 8, 2],
    [0, 2, 9, 2], [0, 3, 10, 1], [0, 4, 11, 0], [0, 5, 13, 0],
    [0, 6, 14, 0], [0, 7, 16, 0], [0, 8, 18, 0], [0, 9, 20, 0],
    [1, 0, 8, 2], [1, 1, 9, 1], [1, 2, 10, 1], [1, 3, 11, 0],
    [1, 4, 13, 0], [1, 5, 14, 0], [1, 6, 16, 0], [1, 7, 18, 0],
    [1, 8, 20, 0], [1, 9, 22, 0], [2, 0, 9, 1], [2, 1, 10, 1],
    [2, 2, 11, 0], [2, 3, 13, 0], [2, 4, 14, 0], [2, 5, 16, 0],
    [2, 6, 18, 0], [2, 7, 20, 0], [2, 8, 22, 0], [2, 9, 24, 0],
    [3, 0, 10, 1], [3, 1, 11, 0], [3, 2, 13, 0], [3, 3, 14, 0],
    [3, 4, 16, 0], [3, 5, 18, 0], [3, 6, 20, 0], [3, 7, 22, 0],
    [3, 8, 24, 0], [3, 9, 26, 0], [4, 0, 11, 0], [4, 1, 13, 0],
    [4, 2, 14, 0], [4, 3, 16, 0], [4, 4, 18, 0], [4, 5, 20, 0],
    [4, 6, 22, 0], [4, 7, 24, 0], [4, 8, 26, 0], [4, 9, 28, 0],
    [5, 0, 13, 0], [5, 1, 14, 0], [5, 2, 16, 0], [5, 3, 18, 0],
    [5, 4, 20, 0], [5, 5, 22, 0], [5, 6, 24, 0], [5, 7, 26, 0],
    [5, 8, 28, 0], [5, 9, 30, 0], [6, 0, 14, 0], [6, 1, 16, 0],
    [6, 2, 18, 0], [6, 3, 20, 0], [6, 4, 22, 0], [6, 5, 24, 0],
    [6, 6, 26, 0], [6, 7, 28, 0], [6, 8, 30, 0], [6, 9, 32, 0],
    [7, 0, 16, 0], [7, 1, 18, 0], [7, 2, 20, 0], [7, 3, 22, 0],
    [7, 4, 24, 0], [7, 5, 26, 0], [7, 6, 28, 0], [7, 7, 30, 0],
    [7, 8, 32, 0], [7, 9, 34, 0], [8, 0, 18, 0], [8, 1, 20, 0],
    [8, 2, 22, 0], [8, 3, 24, 0], [8, 4, 26, 0], [8, 5, 28, 0],
    [8, 6, 30, 0], [8, 7, 32, 0], [8, 8, 34, 0], [8, 9, 36, 0],
    [9, 0, 20, 0], [9, 1, 22, 0], [9, 2, 24, 0], [9, 3, 26, 0],
    [9, 4, 28, 0], [9, 5, 30, 0], [9, 6, 32, 0], [9, 7, 34, 0],
    [9, 8, 36, 0], [9, 9, 38, 0], [10, 0, 22, 0], [10, 1, 24, 0],
    [10, 2, 26, 0], [10, 3, 28, 0], [10, 4, 30, 0], [10, 5, 32, 0],
    [10, 6, 34, 0], [10, 7, 36, 0], [10, 8, 38, 0], [10, 9, 40, 0],
    [11, 0, 24, 0], [11, 1, 26, 0], [11, 2, 28, 0], [11, 3, 30, 0],
    [11, 4, 32, 0], [11, 5, 34, 0], [11, 6, 36, 0], [11, 7, 38, 0],
    [11, 8, 40, 0], [11, 9, 42, 0]
];

// -------------------------------------------------------------------

    static generateRnt() { return Math.floor(Math.random() * 10); }

// -------------------------------------------------------------------
    static playerGenerator(name) {
        const player = {
            name: name,
            endurance: Game.generateRnt() + 20,
            enduranceMax: 0,
            combatSkill: Game.generateRnt() + 10,
            tabDiscipline: new Array(10).fill(false),
            nbrDiscipline: 0,
            tabWeapon: new Array(10).fill(false),
            nbrWeapon: 0,
            weaponskillWeapon: -1,
            bag: {
                gold: Game.generateRnt() + 10,
                meals: 0,
                potionsHealing: 0,
                arrows: 0,
                specialItems: new Array(7).fill(false)
            },
            combat: false
        };
        player.enduranceMax = player.endurance;
        return player;
    }

    static chooseWeapon(player, weaponIndex) {
        if (player.nbrWeapon >= Game.WEAPON_MAX) return false;
        
        if (weaponIndex >= 0 && weaponIndex < 10 && !player.tabWeapon[weaponIndex]) {
            player.tabWeapon[weaponIndex] = true;
            player.nbrWeapon++;
            return true;
        }
        return false;
    }

    static chooseDiscipline(player, disciplineIndex) {
        if (player.nbrDiscipline >= 6) return false;
        
        if (disciplineIndex >= 0 && disciplineIndex < 10 && !player.tabDiscipline[disciplineIndex]) {
            player.tabDiscipline[disciplineIndex] = true;
            player.nbrDiscipline++;
            
            if (disciplineIndex === Game.Disciplines.WEAPONSKILL) {
                player.weaponskillWeapon = Game.generateRnt();
                const weaponNames = [
                    "Dagger", "Spear", "Mace", "Short Sword", 
                    "Warhammer", "Sword", "Axe", "Quarterstaff",
                    "Broadsword", "Bow"
                ];
                updateDisplay(`[Le Bonus s'appliquera à l'arme : ${weaponNames[player.weaponskillWeapon]}]`);
                if (player.tabWeapon[player.weaponskillWeapon]) {
                    updateDisplay("[Arme Possédée, +2 en habileté en combat si équipée]");
                }
            }
            return true;
        }
        return false;
    }

// -------------------------------------------------------------------

    static savePlayer(player, saveName = "autosave") {
        const saveData = {
            name: player.name,
            endurance: player.endurance,
            enduranceMax: player.enduranceMax,
            combatSkill: player.combatSkill,
            disciplines: player.tabDiscipline,
            weapons: player.tabWeapon,
            weaponskillWeapon: player.weaponskillWeapon,
            bag: player.bag
        };

        // Sauvegarde dans localStorage
        localStorage.setItem(`playerSave_${saveName}`, JSON.stringify(saveData));
        
        // Sauvegarde dans un fichier (pour démonstration)
        this.saveToFile(saveData, "ressources/player.json");
        
        return saveData;
    }

    static saveToFile(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static async loadPlayer(saveName = "autosave") {
        const saveData = localStorage.getItem(`playerSave_${saveName}`);
        if (saveData) return JSON.parse(saveData);

        try {
            const response = await fetch("ressources/player.json");
            return response.ok ? await response.json() : null;
        } catch (e) {
            return null;
        }
    }

// -------------------------------------------------------------------

    static gainGold(player, amount) {
        player.bag.gold += amount;
        if (player.bag.gold > Game.GOLD_MAX) {
            player.bag.gold = Game.GOLD_MAX;
            console.log("[Votre Or est au maximum !]\n");
        }
    }

    static eat(player) {
        if (player.tabDiscipline[Game.Disciplines.HUNTING]) {
            console.log("Pas besoin de manger");
        } else if (player.bag.meals > 0) {
            player.bag.meals--;
        } else {
            player.endurance -= 3;
        }
    }

    static heal(player) {
        if (!player.combat) {
            if (player.bag.potionsHealing > 0) {
                if (player.endurance === player.enduranceMax) {
                    console.log("[Endurance déjà au maximum !]\n");
                    return;
                }
                player.bag.potionsHealing--;
                player.endurance += 4;
                
                if (player.endurance > player.enduranceMax) {
                    player.endurance = player.enduranceMax;
                    console.log("[Endurance au maximum !]\n");
                }
            } else {
                console.log("[Pas assez de Potions !]\n");
            }
        } else {
            console.log("[Vous ne pouvez pas vous soigner pendant un combat !]\n");
        }
    }

// -------------------------------------------------------------------

// ==== FONCTIONS DE COMBAT ====

    static calculePoint(rc, nbrRand) {
        const entry = Game.combatTable.find(
            ([tabRc, tabRand]) => tabRc === rc && tabRand === nbrRand
        );
        return entry ? { hero: entry[2], enemi: entry[3] } : { hero: 0, enemi: 0 };
    }

    static calculeRc(habHero, habEnemi) {
        let rc = habHero - habEnemi;
        return Math.max(-11, Math.min(11, rc));
    }

    static combat(player, enemy) {
        const rc = Game.calculeRc(player.combatSkill, enemy.combatSkill);
        
        while (player.endurance > 0 && enemy.endurance > 0) {
            const nbr = Game.generateRnt();
            const damages = Game.calculePoint(rc, nbr);
            
            player.endurance -= damages.hero;
            enemy.endurance -= damages.enemi;
        }
    }
}

// -------------------------------------------------------------------

// ==== FONCTIONS DE CREATION DE PERSONNAGE ====
function createPlayer() {
    const input = document.getElementById("playerName");
    const name = input.value.trim();

    if (!name) {
        updateDisplay("Entrez un nom de joueur valide");
        return;
    }

    player = Game.playerGenerator(name);
    updateDisplay(`Joueur créé : ${name}`);
    updateDisplay("Choisissez votre arme ci-dessous.");
    showStep("step-weapon");
    renderWeaponChoices();
}

function renderWeaponChoices() {
    const weapons = [
        "Dagger", "Spear", "Mace", "Short Sword", "Warhammer",
        "Sword", "Axe", "Quarterstaff", "Broadsword", "Bow"
    ];
    const container = document.getElementById("weapon-choices");
    container.innerHTML = "";

    weapons.forEach((weapon, i) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = `${i + 1} - ${weapon}`;
        link.onclick = () => {
            if (Game.chooseWeapon(player, i)) {
                updateDisplay(`Arme choisie : ${weapon}`);
                
                // Passer aux disciplines après avoir choisi 2 armes
                if (player.nbrWeapon == 1) {
                    showStep("step-disciplines");
                    renderDisciplineChoices();
                }
            } else {
                updateDisplay("Choix invalide ou déjà possédé !");
            }
        };
        container.appendChild(link);
    });
}

function renderDisciplineChoices() {
    const disciplines = [
        "Camouflage", "Hunting", "Sixth Sense", "Tracking", "Weaponskill",
        "Healing", "Mindshield", "Mindblast", "Animal Kinship", "Mind Over Matter"
    ];
    const container = document.getElementById("discipline-choices");
    container.innerHTML = "";

    disciplines.forEach((discipline, i) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = `${i + 1} - ${discipline}`;
        
        // Désactiver visuellement les disciplines déjà choisies
        if (player.tabDiscipline[i]) {
            link.classList.add("disabled");
        }

        link.onclick = () => {
            // Vérifier si on peut encore choisir des disciplines
            if (disciplinesChosen >= MAX_DISCIPLINES) {
                updateDisplay("Vous avez déjà choisi 6 disciplines !");
                return;
            }
            
            if (Game.chooseDiscipline(player, i)) {
                updateDisplay(`Discipline choisie : ${discipline}`);
                link.classList.add("disabled");
                link.onclick = null;
                disciplinesChosen++;

                // Activer le bouton suivant après 6 disciplines
                if (disciplinesChosen >= MAX_DISCIPLINES) {
                    document.getElementById("next-step").style.display = "inline-block";
                    updateDisplay("Choix terminé. Prêt à débuter l'aventure !");
                }
            } else {
                updateDisplay("Choix invalide ou déjà possédé !");
            }
        };
        container.appendChild(link);
    });
}

function nextStep() {
    if (player) {
        // Sauvegarder le joueur avant de continuer
        Game.savePlayer(player, "current");
        updateDisplay("L'aventure commence ! Redirection en cours...");
        
        // Redirection vers la page de l'aventure
        setTimeout(() => {
            window.location.href = "./export/sect1.html";
        }, 1500);
    } else {
        updateDisplay("Veuillez d'abord créer votre personnage");
    }
}

// -------------------------------------------------------------------
