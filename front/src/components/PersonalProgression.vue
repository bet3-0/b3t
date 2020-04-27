<template>
  <div class="container mt-4">
    <h1 :style="'color:' + changeParcoursColor()">
      Ma progression personnelle<br/>{{ getParcoursName() }}
    </h1>
    <button
      @click="$bvModal.show('endModal')" class="btn btn-success"
      style="margin: 1rem"
      v-if="hasEnded"
    >Bravo ! Ton BET est validé !
    </button>
    <div>
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/INPROGRESS.png"/> : Activité en
            cours. Tu peux la reprendre à tout moment !
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter.INPROGRESS
          }}</span>
        </li>
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/FINISHED.png"/> : Activité
            terminée, en cours de validation.
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter.FINISHED + counter.REVIEWING + counter.EXTRA
          }}</span>
        </li>

        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/VALIDATED.png"/> : Activité
            validée.
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter.VALIDATED
          }}</span>
        </li>

        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/REFUSED.png"/> : Activitée
            refusée. Pas de panique, tu peux la recommencer si tu le souhaites !
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter.REFUSED
          }}</span>
        </li>
      </ul>
    </div>

    <Spinner :activated="loading"/>

    <!-- /#wrapper -->
    <div class="container">
      <table class="table">
        <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Nom</th>
          <th scope="col">État</th>
        </tr>
        </thead>
        <tbody>
        <tr
          :key="progression.id"
          @click="sendInfo(progression)"
          style="cursor: pointer"
          v-b-modal="'progressionModal'"
          v-for="progression in displayProgressions"
        >
          <td>
            <svg
              class="bi bi-play-fill"
              fill="currentColor"
              height="1em"
              style="display: inline"
              viewBox="0 0 16 16"
              width="1em"
            >
              <path
                d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"
              />
            </svg>
          </td>
          <td>
            {{
            getActivityName(progression)
            }}
          </td>
          <td>
            <img
              :src="`/img/icons/${progression.state}.png`"
              alt=""
              class="icon"
            />
            {{ getStateName(progression.state) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <ProgressionModal
      :progression="currentProgression"
      :activity="getCurrentActivity()"
    />
    <CongratsModal :idParcours="idParcours"/>
  </div>
</template>

<script>
  import ProgressionModal from "./includes/ProgressionModal";
  import itineraryHelpers from "./../service/itineraryHelpers";
  import ProgressionHelpers from "./../service/progressionHelpers";
  import {VALID_STATES} from "./../service/progressionHelpers";
  import Vue from "vue";
  import BootstrapVue from "bootstrap-vue";
  import VueRouter from "vue-router";
  import ProgressionService from "./../service/progression.service";
  import Spinner from "./includes/Spinner";
  import activityService from "../service/activity";
  import CongratsModal from "./includes/CongratsModal";

  Vue.use(BootstrapVue);
  Vue.use(VueRouter);

  export default {
    name: "PersonalProgression",
    components: {CongratsModal, ProgressionModal, Spinner},
    data() {
      return {
        loading: true,
        hasEnded: false,
        idParcours: this.$store.state.parcours.parcours,
        currentProgression: {},
        progressions: [],
        displayProgressions: [],
        counter: {
          NOTSTARTED: 0,
          INPROGRESS: 0,
          FINISHED: 0,
          EXTRA: 0,
          REVIEWING: 0,
          VALIDATED: 0,
          REFUSED: 0,
        },
      };
    },
    created() {
      // Check if parcours is defined. If not, redirect to /parcours
      if (isNaN(this.idParcours) || (this.idParcours > 3)) {
        return this.$router.push("/parcours");
      }
    },
    async mounted() {
      this.loading = true;
      let progressions = await ProgressionService.getProgressions();
      console.log(progressions)
      if (progressions) {
        // Show only progressions of the Parcours.
        this.progressions = progressions;
        this.displayProgressions = progressions.filter(
          (prog) => prog.state !== "NOTSTARTED"
        ).sort((a, b) => ((b.finishedAt || b.startedAt) - (a.finishedAt || a.startedAt)));
        // NOTSTARTED est utilisée pour la toute première et la toute dernière progression
        // qui permet de définir le parcours ou terminer le parcours
        // The last activities started or completed are the first in the list.

        // Update the global progression
        const globalProgression = activityService.getGlobalProgressionFromProgressions(progressions)
        this.$store.dispatch("progression/setProgression", globalProgression);
        if (this.$store.state.progression.hasEnded) {
          await this.endParcours()
        }
      } else {
        alert("Impossible de charger tes activités ! Tu peux rafraîchir la page pour réessayer.")
        this.progressions = []
        this.displayProgressions = [
          {
            id: "Erreur",
            state: "UNKNOWN", // error
            commentaire: "Une erreur inconnue est survenue ! Recharge la page !",
          },
        ];
      }
      this.countProgressionStates();
      this.loading = false;
    },

    methods: {
      async endParcours() {
        // Progressions must be up to date
        this.progressions.forEach((prog) => {
          if (prog.state === 'NOTSTARTED' && prog.idActivite == "-2") {
            this.hasEnded = true
          }
        })
        if (this.hasEnded) {
          // End message has already been displayed
          return
        }
        console.log("Progressions:", this.progressions)
        // state "NOTSTARTED" + idActivite == -1 --> choix de parcours
        // state "NOTSTARTED" + idActivite == -2 --> fin de parcours
        let parcoursFirstProgression = {
          state: "NOTSTARTED",
          nom: "Parcours terminé",
          idActivite: "-2",
          idParcours: JSON.stringify(parseInt(this.idParcours)),
          entries: [],
        };
        let isEnded = await ProgressionService.createProgression(
          parcoursFirstProgression
        );
        if (!isEnded) {
          console.warn("Impossible to send end progression. " +
            "The congratulation message will be displayed next time.")
        }
        this.$bvModal.show("endModal")
      },

      getStateName: ProgressionHelpers.getStateName,
      getActivity: ProgressionHelpers.getActivityFromLocalStorage,
      getActivityName(progression) {
        if (progression.nom) {
          return progression.nom
        }
        const activity = this.getActivity(progression.idParcours, progression.idActivite);
        if (!activity) {
          return "Activité invalide"
        }
        return activity.nom || "Activité au nom inconnu";
      },
      getCurrentActivity() {
        return this.getActivity(
          this.currentProgression.idParcours,
          this.currentProgression.idActivite
        );
      },
      sendInfo(progression) {
        this.currentProgression = progression;
      },
      countProgressionStates() {
        this.displayProgressions.forEach((progression) => {
          if (VALID_STATES.includes(progression.state)) {
            this.counter[progression.state]++;
          }
        });
      },
      getParcoursImageName() {
        return itineraryHelpers.getParcoursImageName(this.idParcours);
      },
      getParcoursName() {
        return itineraryHelpers.getParcoursName(this.idParcours);
      },
      changeParcoursColor() {
        return itineraryHelpers.getItineraryColor(this.idParcours);
      },
    },
  };
</script>

<style scoped>
  .icon {
    width: 30px;
  }

  .choices-container {
    margin-top: 3em;
  }

  .choices {
    display: flex;
    justify-content: space-evenly;
  }

  #activities p {
    margin: 0;
  }

  #activities p {
    width: 20%;
  }

  #activities p:first-of-type {
    width: 45%;
  }

  #activities p:last-of-type {
    text-align: right;
  }

  .choices li {
    list-style-type: none;
  }

  .choice {
    border: solid;
    cursor: pointer;
    padding: 1em;
    border-radius: 10px;
    transition: background-color 0.3s, color 0.3s, border 0.3s;
  }

  .choice:hover {
    transform: translate(0, -10px);
  }

  .active {
    background-color: #0077b3;
    border: solid #0077b3;
    color: white;
  }
</style>
