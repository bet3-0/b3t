<template>
  <div class="container mt-4">
    <h1>
      Activités à valider
    </h1>
    <div>
      <button @click="pollData()" class="btn btn-primary">Mettre à jour</button>
      <b-dropdown
        id="dropdown-parcours"
        :text="currentParcours"
        variant="primary"
        class="m-md-2"
      >
        <b-dropdown-item @click="filter(4)">Tous les parcours</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="filter(0)">Bosses et Bobos</b-dropdown-item>
        <b-dropdown-item @click="filter(1)">Trois étoiles</b-dropdown-item>
        <b-dropdown-item @click="filter(2)">Cés'Arts</b-dropdown-item>
        <b-dropdown-item @click="filter(3)">Robinson</b-dropdown-item>
      </b-dropdown>
    </div>
    <Spinner :activated="loading"/>

    <!-- /#wrapper -->
    <div class="container">
      <table class="table">
        <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Activité</th>
          <th scope="col">État</th>
          <th scope="col">Date d'envoi</th>
        </tr>
        </thead>
        <tbody>
        <tr
          :key="progression.id"
          :style="
              'cursor: pointer; color:' +
                changeParcoursColor(progression.idParcours)
            "
          @click="sendInfo(progression)"
          v-b-modal="'validationModal'"
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
          <td> {{ getActivityName(progression) }}</td>
          <td>
            <img
              :src="`/img/icons/${progression.state}.png`"
              alt=""
              class="icon"
            />
            {{ getStateName(progression.state) }}
          </td>
          <td>
            {{ getDate(progression.finishedAt) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!displayProgressions.length && !loading">
      Aucune progression à valider
    </p>
    <!-- Modal -->
    <ValidationModal :progression="currentProgression"/>
  </div>
</template>

<script>
  import ValidationModal from "./includes/ValidationModal";
  import itineraryHelpers from "./../service/itineraryHelpers";
  import ProgressionHelpers from "./../service/progressionHelpers";
  import {VALID_STATES} from "./../service/progressionHelpers";

  import Vue from "vue";
  import BootstrapVue from "bootstrap-vue";
  import VueRouter from "vue-router";
  import ProgressionService from "../service/progression.service";
  import Spinner from "./includes/Spinner";

  Vue.use(BootstrapVue);
  Vue.use(VueRouter);

  export default {
    name: "ActivitiesToValidate",
    components: {ValidationModal, Spinner},
    data() {
      return {
        loading: true,
        idParcours: 4,
        currentParcours: "Filtrer par parcours",
        currentProgression: {},
        progressions: [],
        displayProgressions: [],
        counter: {
          NOTSTARTED: 0,
          INPROGRESS: 0,
          FINISHED: 0,
          REVIEWING: 0,
          VALIDATED: 0,
          REFUSED: 0,
        },
        interval: null,
      };
    },
    async mounted() {
      await this.loadProgressions();
    },

    methods: {
      async pollData() {
        await this.loadProgressions();
      },
      async loadProgressions() {
        this.loading = true;
        let progressions = await ProgressionService.getUserProgressions();
        if (progressions) {
          this.progressions = progressions;
        } else {
          alert("Impossible de charger la page ! Merci de la recharger pour réessayer.")
          this.progressions = [
            {
              id: "Erreur de chargement",
              state: "NOTSTARTED", // error
              commentaire:
                "Une erreur inconnue est survenue ! Recharge la page !",
            },
          ];
        }
        this.countProgressionStates();
        this.displayProgressions = this.progressions.sort((a, b) => {
          return a.finishedAt - b.finishedAt
        });
        this.loading = false;
      },
      getActivity: ProgressionHelpers.getActivityFromLocalStorage,
      getActivityName(progression) {
        if (progression.nom) {
          return progression.nom
        }
        const activity = this.getActivity(progression.idParcours, progression.idActivite);
        if (!activity) {
          return "Activité invalide";
        }
        return activity.nom || "Activité au nom inconnu";
      },
      getStateName: ProgressionHelpers.getStateName,
      getTimeDiff: ProgressionHelpers.getTimeDiff,
      getDate: ProgressionHelpers.timestampToPrettyDate,
      sendInfo(progression) {
        this.currentProgression = progression;
      },
      countProgressionStates() {
        this.progressions.forEach((progression) => {
          if (VALID_STATES.includes(progression.state)) {
            this.counter[progression.state]++;
          }
        });
      },
      getParcoursName(idParcours) {
        return itineraryHelpers.getParcoursName(idParcours);
      },
      changeParcoursColor(idParcours) {
        return itineraryHelpers.getItineraryColor(idParcours);
      },
      filter(idParcours) {
        if (idParcours == 4) {
          this.displayProgressions = this.progressions;
          this.currentParcours = "Tous les parcours";
        } else {
          this.currentParcours = this.getParcoursName(idParcours);
          this.displayProgressions = this.progressions.filter((progression) => {
            return progression.idParcours == idParcours;
          });
        }
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
