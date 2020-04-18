<template>
  <div class="container mt-4">
    <h1>
      Activités à valider
    </h1>
    <div>
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
      <button class="btn btn-primary" @click="pollData()">Mettre à jour</button>
    </div>
    <!-- /#wrapper -->
    <div class="container">
      <table class="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Activité</th>
            <th scope="col">État</th>
            <th scope="col">Durée prise par le jeune</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="progression in displayProgressions"
            :key="progression.id"
            v-b-modal="'validationModal'"
            @click="sendInfo(progression)"
            :style="
              'cursor: pointer; color:' +
                changeParcoursColor(progression.idParcours)
            "
          >
            <td>
              <svg
                class="bi bi-play-fill"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                style="display: inline"
              >
                <path
                  d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"
                />
              </svg>
            </td>
            <td>{{ getActivityName(progression.idParcours, progression.idActivite) }}</td>
            <td>
              <img
                :src="`/img/icons/${progression.state}.png`"
                alt=""
                class="icon"
              />
              {{ getStateName(progression.state) }}
            </td>
            <td>
              {{ getTimeDiff(progression.finishedAt,progression.startedAt)}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!displayProgressions.length">Aucune progression à valider</p>
    <!-- Modal -->
    <ValidationModal :progression="currentProgression" />
  </div>
</template>

<script>
import ValidationModal from "./includes/ValidationModal";
import itineraryHelpers from "./../service/itineraryHelpers";
import progressionHelpers from "./../service/progressionHelpers";
import { VALID_STATES } from "./../service/progressionHelpers";

import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import ProgressionService from "../service/progression.service";

Vue.use(BootstrapVue);
Vue.use(VueRouter);

export default {
  name: "ActivitiesToValidate",
  components: { ValidationModal },
  data() {
    return {
      idParcours: 4,
      currentParcours: "Filtrer par parcours",
      currentProgression: {},
      progressions: [],
      displayProgressions: [],
      counter: {
        notStarted: 0,
        inProgress: 0,
        finished: 0,
        validated: 0,
        refused: 0,
      },
      interval: null,
    };
  },
  async mounted() {
    await this.loadProgressions();
  },

  // not working...
  ready() {
    this.pollData().then(console.log("updated!"));
    // reload data every 30 seconds
    this.interval = setInterval(
      function() {
        this.pollData().then(console.log("updated!"));
      }.bind(this),
      30000
    );
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  },

  methods: {
    async pollData() {
      await this.loadProgressions();
    },
    async loadProgressions() {
      let progressions = await ProgressionService.getUserProgressions();
      if (progressions) {
        this.progressions = progressions;
      } else {
        this.progressions = [
          {
            id: "error_fetch",
            state: "UNKNOWN", // error
            evaluation: "Une erreur inconnue est survenue ! Recharge la page !",
          },
        ];
      }
      this.countProgressionStates();
      this.displayProgressions = this.progressions;
    },
    getActivity(idParcours, idActivite) {
      try {
        let activities = JSON.parse(localStorage.getItem("activities"));
        return activities[idParcours][idActivite];
      } catch (error) {
        console.error(
          `Activity ${idParcours}/${idActivite} not found in localStorage.`
        );
        return { id: idActivite, idParcours: idParcours, nom: "Nom inconnu" };
      }
    },
    getActivityName(idParcours, idActivite) {
      try {
        let activity = this.getActivity(idParcours, idActivite);
        return activity.nom || "Activité inconnue";
      } catch (error) {
        return "Nom inconnu";
      }
    },
    getStateName: progressionHelpers.getStateName,
    getTimeDiff(finishedAt, startedAt){
      let finishedAtMs=finishedAt*1000;
      let finishedAtDate = new Date(finishedAtMs)
      let startedAtMs=startedAt*1000;
      let startedAtDate = new Date(startedAtMs)
      let diff = finishedAtDate - startedAtDate
      return diff/60000 || "inconnu"
    },
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
