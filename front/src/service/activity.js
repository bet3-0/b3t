import {API_URL} from './config';

const listActivity = [{
    "id": "47",
    "idParcours": "0",
    "nom": "Découverte de l’implantation d’un camp romain",
    "description": "Un lieu de camp romain ou scout, ça comprend quoi? Lorsqu’on réfléchit à l’implantation du lieu de camp, il faut d’abord connaître son lieu, savoir s’il y a des arbres, où est le point d’eau, s’il y a des ronces quelque part…",
    "duree": 15,
    "materiel": ["2 feuilles de papier", "des ciseaux", "un stylo", "Un appareil photo ou un téléphone pouvant prendre des photos"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "6",
    "idParcours": "0",
    "nom": "Fabrication d’un protège papier toilette",
    "description": "Connaître une technique pour avoir de l’eau et du savon à proximité des feuillées. Repartir avec des idées pour aménager des feuillées",
    "duree": 20,
    "materiel": ["un ordinateur", "Une boîte de conserve propre ou une bouteille en plastique vide et sèche", "Une lime ou du papier à poncer si boîte de conserve/ ciseaux si bouteille d’eau", "Un rouleau de papier toilette", "De la ficelle", "du papier", "de la colle", "Un appareil photo"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "7",
    "idParcours": "0",
    "nom": "Connais tu les bonnes pratiques en matière d’hygiène ?",
    "description": "Réfléchis à tes connaissances et tes pratiques en matière d’hygiène lors d’un camp.",
    "duree": 20,
    "materiel": ["Un ordinateur ou du matériel permettant d’avoir accès à la plateforme"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "10",
    "idParcours": "0",
    "nom": "Comment réagir en cas d’accident? Aucune idée",
    "description": "Nous allons te proposer des situations d’urgence. A toi de nous dire ce que tu ferais dans ces cas là, en choisissant la réponse qui te semble la plus adaptée.",
    "duree": 10,
    "materiel": ["Aucun"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "51",
    "idParcours": "0",
    "nom": "Manger que du sanglier, c’est pas très bon pour la santé, faut l’accompagner!",
    "description": "On le sait tous, les gaulois adorent manger du sanglier, mais il est peu souvent accompagné. Or, tu as vu, il est important de manger équilibré pour être un bon guerrier gaulois. Il faut donc manger des fruits et des légumes. ",
    "duree": 10,
    "materiel": ["Un ordinateur ou du matériel permettant d’avoir accès à la plateforme"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "15",
    "idParcours": "0",
    "nom": "Quoi mettre dans la trousse à pharmacie d’unité? Je sais! ",
    "description": "Etre capable de préparer une trousse à pharmacie d’unité",
    "duree": 15,
    "materiel": ["Un ordinateur"],
    "difficulte": "moyen",
    "page": 0
}, {
    "id": "19",
    "idParcours": "0",
    "nom": "Un registre de soins ? Mais pour quoi faire ?",
    "description": "À quoi sert un registre de soins, que contient-il et qui le remplit ?",
    "duree": 10,
    "materiel": [],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "11",
    "idParcours": "0",
    "nom": "Qui appeler ?",
    "description": "Connaître les numéros d’urgence et leurs domaines d’action",
    "duree": 10,
    "materiel": [],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "22",
    "idParcours": "0",
    "nom": "Il me manque quelques ingrédients de la recette",
    "description": "Maintenant que tu sais quoi mettre dans la trousse à pharmacie, sais-tu quoi faire selon le type de blessure? Quel matériel utiliser ?  Répond aux questions suivantes en choisissant la ou les réponses qui te semble(nt) bonne(s).",
    "duree": 15,
    "materiel": [""],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "14",
    "idParcours": "0",
    "nom": "La PLS, Késako?",
    "description": "Savoir ce qu’est la PLS. Savoir quand l’utiliser. Savoir mettre quelqu’un en PLS",
    "duree": 20,
    "materiel": ["Un ordinateur", "Une personne qui accepte de te servir de mannequin pour la mettre en PLS", "Un appareil photo"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "21",
    "idParcours": "0",
    "nom": "Je connais le secret de la potion magique",
    "description": "Maintenant que tu sais quoi mettre dans la trousse à pharmacie, sais-tu quoi faire selon le type de blessure? Quel matériel utiliser? Lis bien chaque situation et explique nous les étapes d’interventions que tu ferais et le matériel dont tu aurais besoin.",
    "duree": 20,
    "materiel": ["Pas de matériel nécessaire"],
    "difficulte": "moyen",
    "page": 0
}, {
    "id": "4",
    "idParcours": "0",
    "nom": "Fabrication d’un porte savon",
    "description": "Connaître une technique pour avoir de l’eau et du savon à proximité des feuillées. Repartir avec des idées pour aménager des feuillées",
    "duree": 15,
    "materiel": ["Un Ordinateur", "Un collant", "Un savon", "Un cintre", "Des Ciseaux", "Un Appareil Photo"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "40",
    "idParcours": "0",
    "nom": "Alcool, tabac, que sais tu sur eux?",
    "description": "Sache que les réponses que tu donnes ici sont anonymes, il n’y a aucun jugement. L’objectif est seulement de te sensibiliser à ces sujets et à ce type de consommation. ",
    "duree": 20,
    "materiel": ["Aucun"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "23",
    "idParcours": "0",
    "nom": "La potion magique ? Connais pas...",
    "description": "Maintenant que tu sais quoi mettre dans la trousse à pharmacie, sais-tu quoi faire selon le type de blessure? Quel matériel utiliser? ",
    "duree": 15,
    "materiel": [""],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "3",
    "idParcours": "0",
    "nom": "Se laver les mains, c’est que les paumes, non? ",
    "description": "Connaître les bons gestes pour se laver les mains et savoir quoi utiliser avec ou sans eau. ",
    "duree": 10,
    "materiel": ["Un ordinateur"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "43",
    "idParcours": "0",
    "nom": "Relaxation - Concentration avant l’action",
    "description": "Le balayage corporel consiste à se concentrer sur son corps et à le passer en revue zone par après zone dans un ordre précis et de manière progressive (de bas en haut ou de haut en bas, en position assise ou couchée).",
    "duree": 25,
    "materiel": ["De quoi écouter la vidéo", "Couverture et coussins si tu le souhaites"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "45",
    "idParcours": "0",
    "nom": "Jamais, je ne me confierai à César mais à Panoramix peut être",
    "description": "Au fil de la journée, selon ton état d’esprit, ce à quoi tu penses, tu ressens tout un tas d’émotion mais arrives tu à les exprimer? Parviens tu à mettre des mots sur ce que tu ressens? A en parler pour te sentir mieux ou à partager ton bonheur, ta bonne humeur?  Peut être choisis tu à qui tu en parles? César, non, c’est l’ennemi mais Panoramix, tu lui fais confiance, c’est un ami? ",
    "duree": 15,
    "materiel": ["Aucun"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "48",
    "idParcours": "0",
    "nom": "Mon plan d’implantation d’un camp romain",
    "description": "Un lieu de camp romain scout, ça comprend quoi?",
    "duree": 15,
    "materiel": ["2 feuilles de papier", "Une paire de ciseaux", "Un stylo", "Des crayons de couleurs", "Un appreil photo ou un téléphone pouvant prendre des photos"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "49",
    "idParcours": "0",
    "nom": "A la découverte des handicaps",
    "description": "Decouvrons les formes de handicap. Il n’y a pas de mauvaise réponse, n’aie donc pas peur de répondre aux différentes questions posées.",
    "duree": 20,
    "materiel": ["Un ordinateur", "Un stylo", "Une feuille", "Des ciseaux", "Des gants de jardinage ou de ski ou du tissu (écharpes)"],
    "difficulte": "moyen",
    "page": 0
}, {
    "id": "5",
    "idParcours": "0",
    "nom": "Fabrication d’un système de distribution d’eau",
    "description": "Connaître une technique pour avoir de l’eau et du savon à proximité des feuillées. Repartir avec des idées pour aménager des feuillées",
    "duree": 20,
    "materiel": ["un ordinateur", "une bouteille en plastique et son bouchon", "de la ficelle", "un tire-bouchon", "un appareil photo", "une bassine"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "50",
    "idParcours": "0",
    "nom": "Une nouvelle sirène pour les pompiers",
    "description": "Sais-tu à quoi sert la sirène des pompiers? Quelle est sa signification?",
    "duree": 10,
    "materiel": ["Une bonne dose d'imagination", "Un appareil pour s'enregistrer ou se filmer"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "42",
    "idParcours": "0",
    "nom": "Ecoute les sangliers et les romains sont là",
    "description": "Il est important de savoir prendre le temps d’observer son environnement et d’être à l’écoute de ce qu’il se passe autour de nous.",
    "duree": 15,
    "materiel": ["Un chronomètre ou réveil ou montre", "Une couverture et/ou un coussin si tu le souhaites"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "1",
    "idParcours": "3",
    "nom": "Atelier Couteau",
    "description": "Réfléchis à tes connaissances et tes pratiques en matière de couteau",
    "duree": 30,
    "materiel": ["Un couteau de Poche", "Un bâton"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "10",
    "idParcours": "3",
    "nom": "Code des templiers et code Chinois",
    "description": "Et, gaulois ! Tu connais le code « chinois » ? Et le code des templiers ? Viens les découvrir dans cet atelier !",
    "duree": 40,
    "materiel": ["Du papier", "Un stylo"],
    "difficulte": "difficile",
    "page": 0
}, {
    "id": "12",
    "idParcours": "3",
    "nom": "Orientation - Le Savais-tu ?",
    "description": "Il existe de nombreux trucs et astuces pour se repérer… Viens les découvrir dans cet atelier le savais-tu ?",
    "duree": 20,
    "materiel": [],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "4",
    "idParcours": "3",
    "nom": "INSTALLATIONS - NŒUDS - Atelier 2 : Installations en camp - À toi de jouer !",
    "description": "Jeune gaulois ! Pour faire cet atelier, tu dois avoir fait l’atelier 1 sur les nœuds, tu sais construire de supers installations en camp. Maintenant, c’est à ton tour d’être créatif et de nous montrer que tu pourrais t’installer seul…",
    "duree": 30,
    "materiel": ["plein d'objets simples"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "7",
    "idParcours": "2",
    "nom": "Théâtre d'ombres",
    "description": " Prépare le matériel que tu as besoin (cf. matériel) et réfléchi aux personnages de ton histoire.",
    "duree": 40,
    "materiel": ["Règles", "Carton fort", "Crayons", "Feuilles de papier calque ou drap blanc", "Peinture ou autres éléments de décorations", "Ciseaux", "Baguettes (pics à brochettes, ou pailles, ou stylos)", "Scotch", "Attache parisiennes pour des marionnettes articulées", "Lampe", "cadre en « bois » (4 tasseaux de bois ou boîte à céréales...)", "Caméra, appareil photo, smartphone ou ordinateur pour se filmer."],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "9",
    "idParcours": "2",
    "nom": "Jonglage",
    "description": "Exprime ta créativité en fabriquant des balles de jonglage à l’effigie de gaulois célèbres à partir de ballons de baudruche et apprend à jongler.",
    "duree": 25,
    "materiel": ["Ballons de baudruche (2 ou 3 par balle)", "pelle ou grande cuillère", "ciseaux", "terre", "entonnoir (ou bouteille plastique découpée)", "feutre ou marqueur pour décorer", "Caméra, appareil photo, smartphone ou ordinateur pour se filmer."],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "10",
    "idParcours": "2",
    "nom": "Poterie en pâte à sel",
    "description": "Modélise un objet ou symbole gaulois à l’aide de tes mains et d’une pâte à sel. Voici quelques idées : menhir, sanglier, maison gauloise, glaive, casque gaulois, moustache, l’arbre maison d’Assurancetourix, le poisson d’Ordralphabétix...",
    "duree": 30,
    "materiel": ["eau tiède", "sel fin", "farine", "(optionnel : colorants alimentaires, épices, graines, pâtes….)", "peinture pour décorer", "autres éléments de décoration à coller (végétaux, paillettes, boutons, feutrine…) ", "Un four pour la cuisson", "Une plaque de cuisson", "Du papier cuisson", "Appareil photo, smartphone ou ordinateur pour prendre en photo ta création."],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "11",
    "idParcours": "2",
    "nom": "Poterie en pâte à modeler",
    "description": "Représente un village gaulois avec de la pâte à modeler à l’aide de tes mains",
    "duree": 15,
    "materiel": ["Pâte à modeler", "Prendre une photo"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "2",
    "idParcours": "2",
    "nom": "Harmonica",
    "description": "Exprime ta créativité en fabriquant un harmonica avec des éléments de récupération. Une fois réalisé amuse toi à jouer de la musique. Sauras tu être meilleur que Assurancetourix avec sa Lyre ?",
    "duree": 10,
    "materiel": ["2 bâtons de glace", "papier épais", "3 élastiques", "scotch", "Caméra, appareil photo, smartphone ou ordinateur pour te filmer"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "3",
    "idParcours": "2",
    "nom": "Kazou",
    "description": "Exprime ta créativité en fabriquant un kazou avec des éléments de récupération. Une fois réalisé amuse toi à chanter comme Assurancetourix avec ton kazou qui va modifier ta voix.",
    "duree": 15,
    "materiel": ["Tuyau d’arrosage", "couteau", "papier cristal ou papier à cigarettes", "élastique", "Caméra, appareil photo, smartphone ou ordinateur pour se filmer."],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "4",
    "idParcours": "2",
    "nom": "Djembe",
    "description": "Exprime ta créativité en fabriquant un djembé avec des éléments de récupération. Une fois réalisé amuse toi à jouer de la musique. Sauras-tu être meilleur qu’Assurancetourix avec sa Lyre ?",
    "duree": 25,
    "materiel": ["Goulot de bouteille plastique", "tube cartonné", "papier épais (Kraft)", "de la colle chaude", "colle à papier peint", "des ciseaux", "crayons", "peinture, pinceaux", "Caméra, appareil photo, smartphone ou ordinateur pour se filmer"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "5",
    "idParcours": "2",
    "nom": "Les Maracas",
    "description": "Exprime ta créativité en fabriquant des maracas avec des éléments de récupération. Une fois réalisé amuse toi à jouer de la musique. Sauras-tu être meilleur qu’Assurancetourix avec sa Lyre ?",
    "duree": 20,
    "materiel": ["Récipients (boîtes d’allumettes, pots de yaourt, bouteilles en plastique, boîtes en métal…)", "petits cailloux, sable, graines...", "papiers à motif, papiers de soie, gommettes ou autres éléments décoratifs", "colle, ciseaux", "Caméra, appareil photo, smartphone ou ordinateur pour se filmer"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "9",
    "idParcours": "0",
    "nom": " A la découverte de la démarche en cas d'accident",
    "description": "Nous allons te proposer des situations d’urgence. A toi de nous dire dans quel ordre appliquerais tu les étapes de la réaction...",
    "duree": 10,
    "materiel": ["Aucun"],
    "difficulte": "facile",
    "page": 0
}, {
    "id": "8",
    "idParcours": "2",
    "nom": "Ombres chinoises",
    "description": "Exprime ta créativité en te mettant en scène en ombres chinoise derrière un drap blanc et raconte nous une histoire gauloise. Si tu as des frères et soeurs n’hésite pas à les solliciter pour faire le show.",
    "duree": 20,
    "materiel": ["Drap", "Lampe", "déguisements et accessoires choisis par rapport à l’histoire", "Caméra, appareil photo, smartphone ou ordinateur pour se filmer."],
    "difficulte": "facile",
    "page": 0
}]

const listProgression = [
    {
        id: 0, // activity id
        state: "enum(NOTSTARTED,INPROGRESS,FINISHED, VALIDATED,REFUSED)",
        duration: 5,
        startedAt: 5,
        finishedAt: 0,
        reviewAt: 0,
        entries: [
            {
                id: 0,
                question:
                    "Prends une photo de ta réalisation et envoie-la pour validation.",
                documents: [],
                typeRendu: "file",
                rendu: "",
                state: "NOTSTARTED",
                tracked: true,
                page: 1, // page where to display the entry
            },
            {
                id: 1,
                question:
                    "As-tu déjà fait un porte savon autrement ou as-tu une idée pour le faire autrement ?",
                documents: [],
                typeRendu: "text",
                rendu: "",
                state: "NOTSTARTED",
                tracked: true,
                page: 2, // page where to display the entry
            },
            {
                id: 2,
                question:
                    "Quel est l’intérêt selon toi d’avoir de l’eau et du savon à proximité des feuillées?",
                documents: [],
                typeRendu: "text",
                rendu: "",
                state: "NOTSTARTED",
                tracked: true,
                page: 2, // page where to display the entry
            },
            {
                id: 3,
                question: "Quelles sont tes habitudes d'hygiène en camp ?",
                documents: [],
                typeRendu: "text",
                rendu: "",
                state: "NOTSTARTED",
                tracked: true,
                page: 2, // page where to display the entry
            },
        ],
    },
    {
        id: 1, // activity id
        state: "enum(NOTSTARTED,INPROGRESS,FINISHED, VALIDATED,REFUSED)",
        duration: 15,
        startedAt: 15,
        finishedAt: 0,
        reviewAt: 0,
        entries: [
            {
                id: 0,
                question:
                    "trie les phrases",
                documents: [],
                typeRendu: "orderList",
                rendu: [
                    'Rincer',
                    'Frotter le savon sur les paumes et le poser',
                    'Remonter jusqu’à la naissance des poignets',
                    'Frotter entre les doigts',
                    'Mouiller les mains',
                    'Frotter le pouce en le faisant tourner entre les doigts, contre la paume de l’autre main.',
                    'Frotter les deux paumes de la main entre elles',
                    'Sécher les mains de préférence par tamponnement avec un essuie main à usage unique.',
                    'Faire pareil avec l’autre pouce',
                    'Frotter les ongles et le dos des doigts',
                    'Frotter le dos des mains',
                ],
                state: "NOTSTARTED",
                tracked: true,
                page: 1, // page where to display the entry
            },
            {
                id: 1,
                question:
                    "quoi utiliser",
                documents: [],
                typeRendu: "text",
                rendu: "",
                state: "NOTSTARTED",
                tracked: true,
                page: 2, // page where to display the entry
            },
            {
                id: 2,
                question:
                    "montre nous",
                documents: [],
                typeRendu: "file",
                rendu: "",
                state: "NOTSTARTED",
                tracked: true,
                page: 3, // page where to display the entry
            },
        ],
    },
    {
        id: 2,
        "idActivite": "10",
        "idParcours": "0",
        "state": "INPROGRESS",
        "duration": 10,
        "startedAt": 0,
        "finishedAt": 0,
        "reviewAt": 0,
        "entries": [
            {
                "position": 0,
                "question":
                    "Situation 1 : Ton meilleur ami à se brûle en mettant la main sur une des pierres tenant la grille de la table à feu.",
                "documents": [],
                "typeRendu": "qcm",
                "rendu": 
                "[{'question':'L’étoile du Berger','reponses':['Est l’étoile la moins brillante','Apparaît souvent en première','Est au-dessus de la Grande Ourse']},{'question':'Hors forêt, la mousse sur les arbres','reponses':['Est plus souvent placée au Nord','Est plus souvent placée au Sud','Recouvre tout l’arbre']},{'question':'L’eau est importante pour les scouts car le corps humain est composé de','reponses':['20% d’eau','50% d’eau','70% d’eau']},{'question':'Quand tu vois une mouche dans la nature, l’eau est souvent','reponses':['Très proche','À moins de 90 m','À moins de 5 km']}]"
                ,
                "state": "NOTSTARTED",
                "tracked": true,
                "page": 1
            },
            {
                "position": 1,
                "question":
                    "Situation 2 : Un ami se coupe en voulant tailler un bout de bois alors que vous êtes en explo.",
                "documents": [],
                "typeRendu": "qcm",
                "rendu": "[{'question':'Que ferais tu en premier ? ','reponses':['Je regarde ça coupure sans rien faire','Je ferme son couteau et le met en lieu sûr','Je cri car ça saigne beaucoup']},{'question':'Et ensuite ?','reponses':['Je préviens les chefs','Je désinfecte','Je mets sous l’eau']},{'question':'Et enfin ?','reponses':['Je lui met de la crème hydratante','Je désinfecte','Je mets un pansement']}]",
                "state": "NOTSTARTED",
                "tracked": true,
                "page": 2
            },
            {
                "position": 2,
                "question": "Question suivante",
                "documents": [],
                "typeRendu": "qcm",
                "rendu": "[{'question':'Est ce que tu vois des étapes dans la réaction commune aux deux situation? Si oui, lesquelles?','reponse':['Prévenir','Proteger','Crier','Soigner','Secourir','Alerter','Désinfecter']}]",
                "state": "NOTSTARTED",
                "tracked": true,
                "page": 3
            },
            {
                "position": 3,
                "question": "Dans quel ordre mettrais tu ces étapes? ",
                "documents": [],
                "typeRendu": "orderList",
                "rendu": [
                    "Alerter",
                    "Secourir",
                    "Proteger"
                ],
                "state": "NOTSTARTED",
                "tracked": true,
                "page": 4
            }
        ]
    },
    {
        id: 3, // activity id
        state: "enum(NOTSTARTED,INPROGRESS,FINISHED, VALIDATED,REFUSED)",
        duration: 40,
        startedAt: 5,
        finishedAt: 0,
        reviewAt: 0,
        entries: [
            {
                id: 0,
                question: "Envoie ta photo ici !",
                documents: [],
                typeRendu: "file",
                rendu: "",
                state: "NOTSTARTED",
                tracked: true,
                page: 6, // page where to display the entry
            }
        ],
    }
]

const init = {
    mode: "cors",
};

export default class activityService {

    // DEPRECATED
    /*
    static async getActivity(id) {
        return await fetch(`${API_URL}activity/id`, init);
    }
    */

    static getProgression(id) {
        return listProgression[id];
    }

    static listActi() {
        return listActivity
    }

    static async getAllActivity() {
        return await fetch(`${API_URL}activites`, init);

    }
}
