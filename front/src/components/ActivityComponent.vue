<!-- ActivityComponent
Base Component for an activity page -->

<template>
  <div class="container" role="main">
    <ActivityProgressBar :progress="progress" />
    <div class="row">
      <div id="main-container" class="activity-container col-12">
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
        <ActivityContent
          :idActivite="activity.id"
          :idParcours="activity.idParcours"
        />
        <div class="end-container">
          <div class="submit-container">
            <!-- Choisir parmi ces deux rendus en fonction de l'activité -->
            <div
              v-for="entry in pageEntries()"
              :key="entry.id"
              style="text-align: center; width: 100%"
            >
              <h3 style="text-align: left">
                {{ entry.question }}
              </h3>
              <UploadFile
                v-if="entry.typeRendu === 'file'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
              <UploadText
                v-if="entry.typeRendu === 'text'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
              <OrderList
                v-if="entry.typeRendu === 'orderList'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
              <Qcm
                v-if="entry.typeRendu === 'qcm'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
            </div>
          </div>
          <ValidateActivityPage
            :activity="activity"
            :pageNumber="pageNumber"
            :changePage="changePage"
            :progression="progression"
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
import OrderList from "./includes/activityComponents/OrderList";
import Qcm from "./includes/activityComponents/Qcm";
import activityService from "./../service/activity";
import itineraryHelpers from "./../service/itineraryHelpers";

import ValidateActivityPage from "./includes/activityComponents/ValidateActivityPage";
import $ from "jquery";
import progressionService from "../service/progression.service";

// temporary script
function getActivityPage(id, idParcours, pageNumber) {
  console.log(
    `Page asked: id=${id} parcours=${itineraryHelpers.getItineraryRouteName(
      idParcours
    )}`
  );
  /*
  this.activityFile = require(`@/assets/pages/activities/${getItineraryRouteName(
    idParcoursactivitees
  )}/${id}/${id}.html`);
  */
  return `<b>Mon activité trop stylée en <i>HTML</i> page ${pageNumber}!</b>`;
}
export default {
  name: "ActivityComponent",
  components: {
    UploadFile,
    UploadText,
    Qcm,
    ValidateActivityPage,
    ActivityContent,
    ActivityProgressBar,
    OrderList
  },
  //props: { pageNumber: Number }, // current page number
  data() {
    return {
      idParcours: NaN,
      pageNumber: 1, // number of the visible page. 1 at start
      progress: 0,
      activity: {},
      progression: {}
    };
  },
  async created() {
    this.id = this.$route.params.idActivity;
    this.idParcours = this.$store.state.parcours.parcours;
    console.log(this.$store.state.activity.activity);
    this.activity = this.$store.state.activity.activity;

    await this.retrieveProgression(this.idParcours, this.id);
  },
  mounted() {
    for (let i = 0; i < this.activity.pages; i++) {
      if (i + 1 !== this.pageNumber) {
        $(`#page${i + 1}`).hide();
      }
    }
    $(".content-container").removeAttr("hidden");
  },
  methods: {
    async retrieveProgression(idParcours, idActivity) {
      // faire un truc plus clean mais tout aussi persistant.
      const activities = JSON.parse(localStorage.getItem("activities")) || {};
      if (!(idParcours in activities)) {
        activities[idParcours] = {};
      }
      if (idActivity in activities[idParcours]) {
        this.progression = activities[idParcours][idActivity].progression; // retrieve the previous progression created.
        return;
      }

      // Retrieve the default progression linked to the activity
      let progression = activityService.getProgression(idParcours, idActivity);

      // Post the new progression
      try {
        this.progression = await progressionService.createProgression(progression);
        this.activity["progression"] = this.progression;
        activities[idParcours][idActivity] = this.activity;
        console.log("Progression created!");
      } catch (error) {
        console.warn("Impossible to create a progression!");
        alert("Impossible de démarrer l'activité ! Recharge la page !");
        // return;
      }
      localStorage["activities"] = JSON.stringify(activities);
    },
    getProgress() {
      let counter = 0;
      let total = 0;
      for (let entryIndex in this.progression.entries) {
        if (this.progression.entries[entryIndex].tracked) {
          total += 1;
          if (this.progression.entries[entryIndex].state === "FINISHED") {
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
    updateEntry(newEntry) {
      if (!this.progression.entries) {
        this.progression.entries = [];
      }
      for (var i in this.progression.entries) {
        if (this.progression.entries[i].id == newEntry.id) {
          this.progression.entries[i] = newEntry;
          break;
        }
      }
      this.getProgress();
    },
    changeParcoursColor() {
      return itineraryHelpers.getItineraryColor(this.activity.idParcours);
    },
    pageEntries() {
      if (!this.progression.entries) {
        return [];
      }
      return this.progression.entries.filter(
        entry => entry.page === this.pageNumber
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
    }
  }
};
</script>

<style scoped>
/* Require main.css */

.activity-container {
  border: dashed;
  border-color: var(--default);
  border-width: thick;
  padding: 2rem 2rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  background-color: #fafafa;
  border-radius: 0.3rem;
}
.details-container {
  margin: 1rem;
  padding: 1rem;
}

.content-container {
  margin: 1rem;
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
}
h1.activity-title {
  color: var(--default);
}
</style>
