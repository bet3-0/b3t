<!-- ActivityComponent
Base Component for an activity page -->

<template>
  <div class="container" role="main">
    <Alert :show="showDismissibleAlert" :text="textAlert" />
    <ActivityProgressBar :progress="progress" />
    <div class="row">
      <div id="main-container" class="activity-container col-12">
        <img
          v-if="!activity.nom"
          class="img-spinner"
          src="/img/icons/spinner.svg"
          alt="Chargement en cours..."
        />
        <h1 class="activity-title" :style="'color:' + changeParcoursColor()">
          {{ activity.nom }}
        </h1>
        <div v-if="pageNumber == 1 && activity.nom" class="details-container">
          <div id="details">
            <div class="card card-body">
              <ul>
                <li>
                  Description:<br />
                  <i>{{ activity.description }}</i>
                </li>
                <li
                  v-if="
                    activity.materiel &&
                      activity.materiel.length &&
                      activity.materiel[0].length
                  "
                >
                  Matériel:
                  <ul>
                    <li v-for="item in activity.materiel" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </li>
                <li>Durée: {{ activity.duree }} minutes</li>
                <li>Difficulté: {{ activity.difficulte }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="end-container">
          <img
            v-if="!progression.id"
            class="img-spinner"
            src="/img/icons/spinner.svg"
            alt="Chargement en cours..."
          />
          <div class="submit-container">
            <!-- Choisir parmi ces deux rendus en fonction de l'activité -->
            <div
              v-for="entry in pageEntries()"
              :key="entry.position"
              style="text-align: center; width: 100%"
            >
              <h3 style="text-align: left">
                Merci de valider les rendus suivants
              </h3>
              <DownloadFile
                v-if="entry.typeRendu === 'file'"
                :idFile="entry.documents[0]"
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
            :updatePage="updatePage"
            :progression="progression"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from "./includes/Alert";
import DownloadFile from "./includes/activityComponents/DownloadFile";
import UploadText from "./includes/activityComponents/UploadText";
import OrderList from "./includes/activityComponents/OrderList";
import Qcm from "./includes/activityComponents/Qcm";
import activityService from "./../service/activity";
import itineraryHelpers from "./../service/itineraryHelpers";
import ActivityProgressBar from "./includes/activityComponents/ActivityProgressBar";

import ValidateActivityPage from "./includes/activityComponents/ValidateActivityPage";
import $ from "jquery";
import ProgressionService from "../service/progression.service";

export default {
  name: "ActivityToValidate",
  components: {
    DownloadFile,
    UploadText,
    Qcm,
    ValidateActivityPage,
    OrderList,
    Alert,
    ActivityProgressBar,
  },
  data() {
    return {
      showDismissibleAlert: false, // for Alert
      textAlert: false, // for Alert
      idActivite: NaN,
      idParcours: NaN,
      idProgression: NaN,
      pageNumber: 1, // number of the visible page. 1 at start
      progress: 0,
      activity: {},
      progression: {},
    };
  },
  async created() {
    // if user not logged in, redirect to /login
    if (!this.$store.state.auth.status.loggedIn) {
      return this.$router.push("/login");
    }

    this.idProgression = this.$route.params.idProgression;

    this.progression = await this.findProgression(this.idProgression);

    this.idActivite = this.progression.idActivite;
    this.idParcours = this.progression.idParcours;

    this.activity = await activityService.getActivity(
      this.idParcours,
      this.idActivite
    );
    this.showCurrentPages();
  },
  updated() {
    this.showCurrentPages();
  },
  beforeMount() {
    this.showCurrentPages();
  },
  mounted() {
    this.showCurrentPages();
  },
  methods: {
    async showCurrentPages() {
      for (let i = 0; i < this.activity.page; i++) {
        if (i + 1 !== this.pageNumber) {
          $(`#page${i + 1}`).hide();
        }
      }
      $(".content-container").removeAttr("hidden");
    },

    async findProgression(progressionId) {
      let progression = await ProgressionService.getUserProgression(
        progressionId
      );
      if (!progression) {
        console.log("failed to retrieve progression");
        return false; // do not create a new progression and raises an error
      }
      return progression;
    },

    // Activity progression
    getProgress() {
      let counter = this.pageNumber;
      let total = this.activity.page;
      if (total === 0) {
        this.progress = 0; // div by 0
        return;
      }
      this.progress = (100 * counter) / total;
    },

    updateEntry(entry) {
      console.warn(
        "Should not appear in this view: updateEntry called for entry: "
      );
      console.log(entry);
    },
    changeParcoursColor() {
      return itineraryHelpers.getItineraryColor(this.activity.idParcours);
    },
    pageEntries() {
      if (!this.progression.entries) {
        return [];
      }
      this.progression.entries.forEach((entry) => {
        entry.state = "INREVIEW";
      });
      return this.progression.entries
        .filter((entry) => entry.page === this.pageNumber)
        .sort((a, b) => a.position - b.position);
    },
    async updatePage(pageNumber) {
      if (pageNumber != this.pageNumber) {
        $(`#page${this.pageNumber}`).hide();
        this.pageNumber = pageNumber;
        $(`#page${this.pageNumber}`).show();
      }
      this.getProgress();
      console.log(`Current page number: ${this.pageNumber}`);
      window.scrollTo(0, 0);
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
  padding: 0.5rem 0.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  background-color: #fafafa;
  border-radius: 0.3rem;
}
.details-container {
  margin: 0.5rem;
  padding: 0.5rem;
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
