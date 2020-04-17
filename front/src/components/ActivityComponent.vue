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
        <ActivityContent :idActivite="idActivite" :idParcours="idParcours" />
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
import ProgressionService from "../service/progression.service";

export default {
  name: "ActivityComponent",
  components: {
    UploadFile,
    UploadText,
    Qcm,
    ValidateActivityPage,
    ActivityContent,
    ActivityProgressBar,
    OrderList,
    Alert,
  },
  props: ["pastProgression"],
  data() {
    return {
      showDismissibleAlert: false, // for Alert
      textAlert: false, // for Alert
      idActivite: NaN,
      idParcours: NaN,
      pageNumber: 1, // number of the visible page. 1 at start
      progress: 0,
      activity: {},
      progression: {},
    };
  },
  async created() {
    // if user not logged in, redirect to /login
    // COMMENT: FOR DEBUG ONLY ! TODO: uncomment !
    if (!this.$store.state.auth.status.loggedIn) {
      return this.$router.push("/login");
    }
    this.idActivite = this.$route.params.idActivite;
    this.idParcours = this.$route.params.idParcours;

    this.activity = await activityService.getActivity(
      this.idParcours,
      this.idActivite
    );

    // this.idParcours = this.$store.state.parcours.parcours;
    //console.log(this.$store.state.activity.activity);
    //this.activity = this.$store.state.activity.activity;
    //this.$store.state.activity.activity = undefined;

    await this.retrieveProgression(this.idParcours, this.idActivite);
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
      let progressions = await ProgressionService.getProgressions();
      if (!progressions) {
        console.log("failed to retrieve progressions");
        return false; // do not create a new progression and raises an error
      }
      let existingProgression = progressions.find(
        (prog) => prog.id == progressionId
      );
      if (!existingProgression) {
        console.log("Existing progression id is incorrect!");
        return "TOCREATE"; // do create a new progression
      }
      if (["FINISHED", "INREVIEW"].includes(existingProgression.state)) {
        console.log("Existing progression is in a non editable state");
        return false; // do not create a new progression and raises an error
      }
      return existingProgression;
    },
    async retrieveProgression(idParcours, idActivity) {
      // FIRST OPTION: progression comes from PersonalProgression page: up to date
      if (this.$store.state.activity.progression) {
        // loaded from PersonalProgression vue
        this.progression = this.$store.state.activity.progression;
        this.$store.state.activity.progression = undefined;
        return;
      }

      const activities = JSON.parse(localStorage.getItem("activities")) || {};
      if (!(idParcours in activities)) {
        activities[idParcours] = {};
      }
      if (idActivity in activities[idParcours]) {
        let savedProgression = activities[idParcours][idActivity].progression; // retrieve the previous progression created.
        // SECOND OPTION: a progression previously started. Its id is store in localStorage.
        if (savedProgression) {
          let progression = await this.findProgression(savedProgression.id);
          if (progression == "TOCREATE") {
            console.log("Creating a new progression");
          } else if (progression) {
            this.progression = progression;
            return;
          } else {
            this.textAlert =
              "Tu as déjà fait cette activité ! Elle est sûrement en train d'être relue, tu peux le voir sur la page Progression Personnelle !";
            this.showDismissibleAlert = true;
            //alert("Tu as déjà fait cette activité ! Elle est sûrement en train d'être relue, tu peux le voir sur la page Progression Personnelle !");
          }
        }
      }

      // THIRD OPTION: No progression exists: retrieve a new one and post it to backend
      // Retrieve the default progression linked to the activity
      let progression = activityService.getProgression(idParcours, idActivity);

      // Post the new progression
      try {
        this.progression = await ProgressionService.createProgression(
          progression
        );
        this.activity.progression = this.progression; // store the progression for future reconnexion
        activities[idParcours][idActivity] = this.activity;
        console.log("Progression created!");
      } catch (error) {
        console.warn("Impossible to create a progression!");
        this.textAlert =
          "Impossible de démarrer l'activité ! Recharge la page !";
        this.showDismissibleAlert = true;
        // alert("Impossible de démarrer l'activité ! Recharge la page !");
        this.progression = progression;
        // return;
      }
      localStorage.activities = JSON.stringify(activities);
    },
    // Activity progression
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
    async updateEntry(entry) {
      entry.state = "FINISHED";
      console.log("update:");
      console.log(entry.rendu);
      console.log(entry.parsedRendu);

      if (entry.parsedRendu) {
        entry.rendu = JSON.stringify(entry.parsedRendu);
      }
      try {
        await ProgressionService.updateProgression(entry, "entry");
        console.log("Answer sent: " + entry.rendu);
        this.updateEntryInProgression(entry); // update the primary progression object
      } catch (error) {
        console.log("Error while sending text entry: " + entry.rendu);
        entry.state = "INPROGRESS";
        alert(
          "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
        );
      }
    },
    updateEntryInProgression(newEntry) {
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
    async validatePageEntries() {
      if (!this.progression.entries) {
        return;
      }
      this.progression.entries.forEach(async (entry) => {
        if (entry.page == this.pageNumber) {
          await this.updateEntry(entry);
        }
      });
    },
    pageEntries() {
      if (!this.progression.entries) {
        return [];
      }
      return this.progression.entries
        .filter((entry) => entry.page === this.pageNumber)
        .sort((a, b) => a.position - b.position);
    },
    async updatePage(pageNumber) {
      await this.validatePageEntries();
      if (pageNumber != this.pageNumber) {
        $(`#page${this.pageNumber}`).hide();
        this.pageNumber = pageNumber;
        $(`#page${this.pageNumber}`).show();
      }
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
