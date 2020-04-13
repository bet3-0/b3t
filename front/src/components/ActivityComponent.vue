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
        <ActivityContent :id="activity.id" />
        <div class="end-container">
          <div class="submit-container">
            <!-- Choisir parmi ces deux rendus en fonction de l'activité -->
            <div v-for="entry in pageEntries()" :key="entry.id" style="text-align: center; width: 100%">
              <h3 style="text-align: left">
                {{ entry.question }}
              </h3>
              <UploadFile v-if="entry.typeRendu === 'file'" :activityId="activity.id" :entryId="entry.id" :changeEntryState="changeEntryState"/>
              <UploadText v-if="entry.typeRendu === 'text'" :activityId="activity.id" :entryId="entry.id" :changeEntryState="changeEntryState"/>
              <OrderList  v-if="entry.typeRendu === 'orderList'" :activityId="activity.id" :entryId="entry.id" :changeEntryState="changeEntryState" v-bind:list-response="entry.rendu"/>
              <Qcm  v-if="entry.typeRendu === 'qcm'" :activityId="activity.id" :entryId="entry.id" :changeEntryState="changeEntryState" v-bind:questions="entry.rendu"/>
            </div>
          </div>
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
import OrderList from "./includes/activityComponents/OrderList";
import Qcm from "./includes/activityComponents/Qcm";
import activityService from './../service/activity';
import itineraryHelpers from './../service/itineraryHelpers';

import ValidateActivityPage from "./includes/activityComponents/ValidateActivityPage";
import $ from "jquery";

// temporary script
function getActivityPage(id, idParcours, pageNumber) {
  console.log(
    `Page asked: id=${id} parcours=${itineraryHelpers.getItineraryRouteName(idParcours)}`
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
      pageNumber: 1, // number of the visible page. 1 at start
      progress: 0,
      activity: {},
      progression: {},
    };
  },
  created() {
    this.id = this.$route.params.idActivity;
    console.log(activityService)
    this.activity = activityService.getActivity(this.id)
    this.progression = activityService.getProgression(this.id)
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
      return itineraryHelpers.getItineraryColor(this.activity.idParcours);
    },
    pageEntries() {
      return this.progression.entries.filter(
        (entry) => entry.page === this.pageNumber
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
