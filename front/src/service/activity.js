const listActivity = [
    {
        id: 0,
        idParcours: 0,
        nom: "Fabrication d’un porte savon",
        description:
            "Astérix et Obélix  adorent partir en camp... Seulement voilà, il y a une chose qu’ils ne supportent pas, ce sont les feuillées dégoûtantes et mal agencées. Du coup à chaque fois qu’ils partent camper pour repousser les romains, ils prennent le temps  pour construire des feuillées parfaites. Aujourd’hui ils sont pris de court, c’est assez rare qu’ils aient autant d’invités pour fêter leur réussite. Il leur manque encore trois choses : le porte savon, le système de distribution d’eau et le protège papier toilette. Astérix vient alors te chercher pour te demander ton aide. Tu ne fabriqueras qu’un seul de ces éléments à la fois, à toi de choisir le ou lesquels !",
        duree: 15, // minutes
        materiel: [
            "Un collant",
            "Un savon ou des bouts de savon",
            "Un cintre",
            "Des ciseaux",
            "Un appareil photo ou téléphone",
        ],
        difficulte: "facile",
        pages: 2,
    },
    {
        id: 1,
        idParcours: 0,
        nom: "Se laver les mains",
        description: "Il faut bien se laver les mains",
        duree: 5, // minutes
        materiel: [
            "un truc qui filme",
            "Du savon"
        ],
        difficulte: "facile",
        pages: 3,
    },
    {
        id: 2,
        idParcours: 0,
        nom: "Les étapes de la préparation d’un plat",
        description: "Il faut bien se laver les mains",
        duree: 10, // minutes
        materiel: ["Aucun"],
        difficulte: "moyen",
        pages: 2,
    },
    {
        id: 3,
        idParcours: 0,
        nom: "Code des templiers et code Chinois",
        description:
            "Et, gaulois ! Tu connais le code « chinois » ? Et le code des templiers ? Viens les découvrir dans cet atelier !",
        duree: 40, // minutes
        materiel: [
            "Du papier",
            "Un stylo"
        ],
        difficulte: "difficile",
        pages: 6,
    }
]

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
        id: 2, // activity id
        state: "enum(NOTSTARTED,INPROGRESS,FINISHED, VALIDATED,REFUSED)",
        duration: 10,
        startedAt: 15,
        finishedAt: 0,
        reviewAt: 0,
        entries: [
            {
                id: 0,
                question:
                    "Réponds aux questions",
                documents: [],
                typeRendu: "qcm",
                rendu: '[{"question":"Quelle étape permet de gagner du temps pendant la préparation du repas ?","reponses":["Sortir le matériel","Maintenir le plat au chaud","Nettoyer la vaisselle et le plan de travail","Éplucher"]},{"question":"Quelle étape peut permettre d’éviter des accident lié à la cuisine ?","reponses":["Maintenir le plat au chaud","Éplucher","Laver les aliments qui le nécessitent","Organiser son plan de travail"]},{"question":"Quelle étape de la préparation du repas permet de respecter les règles d’hygiène ?","reponses":["Découper, râper, rincer","Servir","Se laver les mains","Organiser son plan de travail"]},{"question":"Quelle","reponses":["Sortir","Maintenir","Nettoyer","Éplucher"]}]',
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
            }
        ],
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

const baseUrl = "https://b3t-dev.cleverapps.io/api";
const init = {
    mode: "cors",
}

export default class activityService {


   static getActivity(id) {
        return listActivity[id]
    }

    static getProgression(id) {
        return listProgression[id]
    }

   static async getAllActivity(){
       console.log(baseUrl)
       //return await fetch(`https://jsonplaceholder.typicode.com/todos/1`, init);
       return await fetch(`${baseUrl}/activites`, init);

   }
}
