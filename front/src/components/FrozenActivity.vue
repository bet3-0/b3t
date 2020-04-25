<!-- FrozenActivity
Activity page loaded from YouthActivities component.
 Progressions are not edited in this version.
 -->

<template>
  <div class="container" role="main">
    <Alert :show="showDismissibleAlert" :text="textAlert"/>
    <ActivityProgressBar :progress="progress"/>
    <div class="row">
      <div class="activity-container col-12" id="main-container">
        <Spinner v-if="!activity.nom"/>
        <h1 :style="'color:' + getParcoursColor()" class="activity-title">
          {{ activity.nom }}
        </h1>
        <div class="details-container" v-if="pageNumber === 1 && activity.nom">
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
          <Spinner v-if="!progression.id"/>
          <div class="submit-container">
            <!-- Choisir parmi ces rendus en fonction de l'activité -->
            <div
              :key="entry.position"
              style="text-align: center; width: 100%"
              v-for="entry in pageEntries()"
            >
              <h3 style="text-align: left">
                {{ entry.question }}
              </h3>
              <DownloadFile
                :idFile="entry.documents && entry.documents.length ? entry.documents[0] : undefined"
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
          <div class="container">
            <div class="container-buttons">
              <button
                @click="previousPage()"
                class="btn btn-success"
                v-if="pageNumber > 1"
              >
                Page précédente
              </button>
              <button @click="nextPage()" class="btn btn-success" v-if="hasNext()">
                Page suivante
              </button>
              <button
                @click="goBack()"
                class="btn btn-success"
                v-if="!hasNext()"
              >
                Retourner à la page des progressions de mes jeunes
              </button>
            </div>
          </div>
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
  import $ from "jquery";
  import Spinner from "./includes/Spinner";

  export default {
    name: "ActivityToValidate",
    components: {
      Spinner,
      DownloadFile,
      UploadText,
      Qcm,
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

      this.progression = this.$store.state.activity.progression;
      this.$store.state.activity.progression = undefined;
      if (!this.progression) {
        alert("Impossible de charger la page ou alors tu n'as pas les droits pour voir cette page !")
        return this.$router.push("/youth")
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
      showCurrentPages() {
        for (let i = 0; i < this.activity.page; i++) {
          if (i + 1 !== this.pageNumber) {
            $(`#page${i + 1}`).hide();
          }
        }
        $(".content-container").removeAttr("hidden");
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
      getParcoursColor() {
        return itineraryHelpers.getItineraryColor(this.activity.idParcours);
      },

      // legacy
      updateEntry(entry) {
        console.warn(
          "Should not appear in this view: updateEntry called for entry: "
        );
        console.log(entry);
      },

      // Page management
      hasNext() {
        return this.pageNumber < this.activity.page;
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
      async updateAndCheckPage(newPage) {
        let isUpdated = await this.updatePage(newPage);
        if (!isUpdated) {
          this.titleError = "Impossible d'envoyer tes réponses !";
          this.messageError =
            "Tes réponses sont bloquées ici ! Réessaie pour voir ?";
          this.$bvModal.show("errorModal-VAL");
          return false;
        }
        return true;
      },
      async previousPage() {
        return await this.updateAndCheckPage(this.pageNumber - 1);
      },
      async nextPage() {
        await this.updateAndCheckPage(this.pageNumber + 1);
      },
      async goBack() {
        this.$router.push("/youth")
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

  .container-buttons {
    margin: 1rem;
    display: flex;
    justify-content: space-evenly;
  }
</style>
