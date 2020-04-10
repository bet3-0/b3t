<template>
  <div class="container mt-4">
    <h1>
      Activitées à valider
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
    </div>

    <!-- /#wrapper -->
    <div class="container">
      <table class="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Activité</th>
            <th scope="col">État</th>
            <th scope="col">Nombre de rendus</th>
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
            <td>{{ getActivity(progression).nom }}</td>
            <td>
              <img
                :src="`/img/icons/${progression.state}.png`"
                alt=""
                class="icon"
              />
              {{ getStateName(progression.state) }}
            </td>
            <td>{{ progression.entries.length }}</td>
            <td>
              {{
                (
                  (progression.finishedAt - progression.startedAt) /
                  60000
                ).toFixed(2)
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
        refused: 0
      }
    };
  },
  beforeMount() {
    // TODO: fetch progressions
    this.progressions = [
      {
        id: 5, // primary key (not used here!)
        idActivite: "5",
        idParcours: "0",
        state: "REFUSED", // peut prendre les valeurs enum(notStarted,inProgress,finished, validated, refused)
        duration: 20, // en minutes aussi
        startedAt: 5, // ms
        finishedAt: 152.0, // ms
        reviewAt: 0, // ms
        entries: []
      },
      {
        id: 6,
        idActivite: "6",
        idParcours: "0",
        state: "VALIDATED", // peut prendre les valeurs enum(notStarted,inProgress,finished, validated, refused)
        duration: 20, // en minutes aussi
        startedAt: 5, // ms
        finishedAt: 0, // ms
        reviewAt: 0, // ms
        entries: []
      },
      {
        id: 7,
        idActivite: "7",
        idParcours: "1",
        state: "FINISHED", // peut prendre les valeurs enum(notStarted,inProgress,finished, validated, refused)
        duration: 20, // en minutes aussi
        startedAt: 5, // ms
        finishedAt: 0, // ms
        reviewAt: 0, // ms
        entries: []
      }
    ];
  },
  mounted() {
    this.countProgressionStates();
    this.displayProgressions = this.progressions;
  },
  methods: {
    getStateName: progressionHelpers.getStateName,

    getActivity(progression) {
      // TODO: get activity by id
      // fetchActivityFromProgression(progression)
      return { id: activityId, nom: "Nom générique", idParcours: 0 };
    },
    sendInfo(progression) {
      this.currentProgression = progression;
    },
    countProgressionStates() {
      this.progressions.forEach(progression => {
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
        this.displayProgressions = this.progressions.filter(progression => {
          return progression.idParcours == idParcours;
        });
      }
    }
  }
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
