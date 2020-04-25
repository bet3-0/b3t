<!-- ActivityComponent
Base Component for an activity page -->

<template>
  <div class="container" role="main">
    <Alert :show="showDismissibleAlert" :text="textAlert"/>
    <ActivityProgressBar :progress="progress"/>
    <div class="row">
      <div class="activity-container col-12" id="main-container">
        <img
          alt="Chargement en cours..."
          class="img-spinner"
          src="/img/icons/spinner.svg"
          v-if="!activity.nom"
        />
        <h1 :style="'color:' + changeParcoursColor()" class="activity-title">
          {{ activity.nom }}
        </h1>
        <div class="details-container" v-if="pageNumber == 1 && activity.nom">
          <div id="details">
            <div class="card card-body">
              <ul>
                <li>
                  Description:<br/>
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
                    <li :key="item" v-for="item in activity.materiel">
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
        <ActivityContent :idActivite="idActivite" :idParcours="idParcours"/>
        <div class="end-container">
          <img
            alt="Chargement en cours..."
            class="img-spinner"
            src="/img/icons/spinner.svg"
            v-if="!progression.id"
          />
          <div class="submit-container">
            <!-- Choisir parmi ces deux rendus en fonction de l'activité -->
            <div
              :key="entry.position"
              style="text-align: center; width: 100%"
              v-for="entry in pageEntries()"
            >
              <h3 style="text-align: left">
                {{ entry.question }}
              </h3>
              <DownloadFile
                :idFile="entry.documents[0]"
                v-if="entry.typeRendu === 'file'"
              />
              <UploadText
                :entry="entry"
                :updateEntry="updateEntry"
                v-if="entry.typeRendu === 'text'"
              />
              <OrderList
                :entry="entry"
                :updateEntry="updateEntry"
                v-if="entry.typeRendu === 'orderList'"
              />
              <Qcm
                :entry="entry"
                :updateEntry="updateEntry"
                v-if="entry.typeRendu === 'qcm'"
              />
            </div>
          </div>
          <ValidateActivityPage
            :activity="activity"
            :pageNumber="pageNumber"
            :progression="progression"
            :updatePage="updatePage"
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
  import ActivityContent from "./includes/activityComponents/ActivityContent";

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
      ActivityContent,
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
      this.idProgression = this.$route.params.idProgression;
      this.idActivite = this.$route.params.idActivite;
      this.idParcours = this.$route.params.idParcours;

      this.progression = await this.findProgression(this.idProgression);
      if (!this.progression) {
        alert("Impossible de se connecter ou alors tu n'as les droits pour voir cette page !")
        return
      }

      this.progression.state = "REVIEWING";
      this.progression.entries.forEach(
        (_entry) => (_entry.state = this.progression.state)
      );
      let isUpdated = await ProgressionService.updateProgression(
        this.progression,
        "user/progression"
      );
      if (!isUpdated) {
        alert("Progression invalide !")
        this.$router.push("/validation")
        return
      }
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
          entry.state = "REVIEWING";
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
        return true;
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
