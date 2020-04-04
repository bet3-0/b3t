<!-- ActivityComponent
Base Component for an activity page -->

<template>
  <div class="container" role="main">
    <ActivityProgressBar :progress="progress" />
    <div id="main-container" class="activity-container">
      <h1 class="activity-title" :style="'color:' + changeParcoursColor()">
        {{ activity.nom }}
      </h1>
      <div class="details-container">
        <a
          class="btn btn-secondary"
          data-toggle="collapse"
          href="#details"
          role="button"
          aria-expanded="false"
          aria-controls="details"
        >
          Details
        </a>
        <div class="collapse" id="details">
          <div class="card card-body">
            <ul>
              <li>
                Description:<br />
                <i>{{ activity.description }}</i>
              </li>
              <li>
                Matériel:
                <ul>
                  <li v-for="item in activity.materiel" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </li>
              <li>Durée: {{ activity.duree }} minute(s)</li>
              <li>Difficulté: {{ activity.difficulte }}</li>
            </ul>
          </div>
        </div>
      </div>
      <ActivityContent :id="activity.id" />
      <div class="end-container">
        <div class="submit-container">
          <!-- Choisir parmi ces deux rendus en fonction de l'activité -->
          <ul>
            <li v-for="entry in pageEntries()" :key="entry.id">
              {{ entry.question }}
              <UploadFile
                v-if="entry.typeRendu === 'file'"
                :activityId="activity.id"
                :entryId="entry.id"
                :changeEntryState="changeEntryState"
              />
              <UploadText
                v-if="entry.typeRendu === 'text'"
                :activityId="activity.id"
                :entryId="entry.id"
                :changeEntryState="changeEntryState"
              />
            </li>
          </ul>
        </div>
        <div class="next-container">
          <ValidateActivityPage
            :activity="activity"
            :pageNumber="pageNumber"
            :changePage="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityContent from "./includes/activityComponents/ActivityContent";
import ActivityProgressBar from "./includes/activityComponents/ActivityProgressBar";
import UploadFile from "./includes/activityComponents/UploadFile";
import UploadText from "./includes/activityComponents/UploadText";
import ValidateActivityPage from "./includes/activityComponents/ValidateActivityPage";
import $ from "jquery";

function getParcoursColor(idParcours) {
  switch (idParcours) {
    case 0:
      return "var(--bosses-et-bobos)";
    case 1:
      return "var(--trois-etoiles)";
    case 2:
      return "var(--cesart)";
    case 3:
      return "var(--robinson)";
    default:
      return "var(--default)";
  }
}
function getParcoursRouteName(idParcours) {
  switch (idParcours) {
    case 0:
      return "bosses_et_bobos";
    case 1:
      return "trois_etoiles";
    case 2:
      return "cesart";
    case 3:
      return "robinson";
    default:
      return "default";
  }
}

// temporary script
function getActivityPage(id, idParcours, pageNumber) {
  console.log(
    `Page asked: id=${id} parcours=${getParcoursRouteName(idParcours)}`
  );
  /*
  this.activityFile = require(`@/assets/pages/activities/${getParcoursRouteName(
    idParcours
  )}/${id}/${id}.html`);
  */
  return `<b>Mon activité trop stylée en <i>HTML</i> page ${pageNumber}!</b>`;
}
export default {
  name: "ActivityComponent",
  components: {
    UploadFile,
    UploadText,
    ValidateActivityPage,
    ActivityContent,
    ActivityProgressBar,
  },
  //props: { pageNumber: Number }, // current page number
  data() {
    return {
      pageNumber: 1, // number of the visible page. 1 at start
      progress: 0,
      activity: {
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
      progression: {
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
            state: "notStarted",
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
            state: "notStarted",
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
            state: "notStarted",
            tracked: true,
            page: 2, // page where to display the entry
          },
          {
            id: 3,
            question: "Quelles sont tes habitudes d'hygiène en camp ?",
            documents: [],
            typeRendu: "text",
            rendu: "",
            state: "notStarted",
            tracked: true,
            page: 2, // page where to display the entry
          },
        ],
      },
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
    for (let i = 0; i < this.activity.pages; i++) {
      if (i + 1 != this.pageNumber) {
        $(`#page${i + 1}`).hide();
      }
    }
    $(".content-container").removeAttr("hidden");
  },
  methods: {
    getProgress() {
      let counter = 0;
      let total = 0;
      for (let entry in this.progression.entries) {
        if (this.progression.entries[entry].tracked) {
          total += 1;
          if (this.progression.entries[entry].state === "finished") {
            counter += 1;
          }
        }
      }
      if (total === 0) {
        this.progress = 0; // div by 0
        return;
      }
      this.progress = (100 * counter) / total;
    },
    changeEntryState(entryId, state) {
      this.progression.entries[entryId].state = state;
      this.getProgress();
    },
    changeParcoursColor() {
      let color = getParcoursColor(this.activity.idParcours);
      return color;
    },
    pageEntries() {
      return this.progression.entries.filter(
        (entry) => entry.page == this.pageNumber
      );
    },
    changePage(pageNumber) {
      $(`#page${this.pageNumber}`).hide();
      this.pageNumber = pageNumber;
      $(`#page${this.pageNumber}`).show();
      console.log(`Current page number: ${this.pageNumber}`);
    },
    activityFile() {
      return getActivityPage(
        this.activity.id,
        this.activity.idParcours,
        this.pageNumber
      );
    },
  },
};
</script>

<style scoped>
/* Require main.css */

.activity-container {
  border: dashed;
  border-color: var(--default);
  border-width: thick;
  padding: 1rem 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  background-color:#fafafa; /* light gray */
  border-radius: 0.3rem;
}
.details-container {
  margin: 1rem;
  padding: 1rem;
}

.content-container {
  padding: 1rem;
}

.end-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.submit-container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-evenly;
}

h1.activity-title {
  color: var(--default);
}
</style>
