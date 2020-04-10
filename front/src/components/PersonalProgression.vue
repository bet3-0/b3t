<template>
  <div class="container mt-4">
    <h1 :style="'color:' + changeParcoursColor()">
      Ma progression personnelle<br />{{ getParcoursName() }}
    </h1>
    <div>
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/inProgress.png" /> : Activité en
            cours. Tu peux la reprendre à tout moment !
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter["inProgress"]
          }}</span>
        </li>
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/finished.png" /> : Activité
            terminée, en cours de validation.
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter["finished"]
          }}</span>
        </li>

        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/validated.png" /> : Activité
            validée.
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter["validated"]
          }}</span>
        </li>

        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/refused.png" /> : Activitée
            refusée. Pas de panique, tu peux la recommencer si tu le souhaites !
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter["refused"]
          }}</span>
        </li>
      </ul>
    </div>

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
            v-for="progression in progressions"
            :key="progression.id"
            v-b-modal="'progressionModal'"
            @click="sendInfo(progression)"
            style="cursor: pointer"
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
            <td>{{ getActivity(progression.id).nom }}</td>
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
  </div>
</template>

<script>
import ProgressionModal from "./includes/ProgressionModal";
import itineraryHelpers from "./../service/itineraryHelpers";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";

Vue.use(BootstrapVue);
Vue.use(VueRouter);

/*
    valeurs possible de state:
    notStarted, inProgress, finished, validated, refused
    */
const VALID_STATES = [
  "notStarted",
  "inProgress",
  "finished",
  "validated",
  "refused"
];

export default {
  name: "PersonalProgression",
  components: { ProgressionModal },
  data() {
    return {
      idParcours: 4,
      currentProgression: {},
      progressions: [],
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
    // TODO: use store instead of localStorage (more "VueJS"-practice)
    this.idParcours = parseInt(localStorage.getItem("parcours")) || 5;
    // TODO: fetch progressions
    this.progressions = [
      {
        id: 5, // FOREIGN KEY de activity
        state: "refused", // peut prendre les valeurs enum(notStarted,inProgress,finished, validated, refused)
        duration: 20, // en minutes aussi
        startedAt: 5, // ms
        finishedAt: 0, // ms
        evaluation: "refusé",
        reviewAt: 0, // ms
        entries: []
      },
      {
        id: 6,
        state: "validated", // peut prendre les valeurs enum(notStarted,inProgress,finished, validated, refused)
        duration: 20, // en minutes aussi
        startedAt: 5, // ms
        finishedAt: 0, // ms
        reviewAt: 0, // ms
        evaluation: "validé",
        entries: []
      },
      {
        id: 7,
        state: "finished", // peut prendre les valeurs enum(notStarted,inProgress,finished, validated, refused)
        duration: 20, // en minutes aussi
        startedAt: 5, // ms
        finishedAt: 0, // ms
        reviewAt: 0, // ms
        evaluation: "",
        entries: []
      },
      {
        id: 7,
        state: "INPROGRESS", // peut prendre les valeurs enum(notStarted,inProgress,finished, validated, refused)
        duration: 20, // en minutes aussi
        startedAt: 5, // ms
        finishedAt: 0, // ms
        reviewAt: 0, // ms
        evaluation: "",
        entries: []
      }
    ];
  },
  mounted() {
    this.countProgressionStates();
  },
  methods: {
    getStateName(state) {
      switch (state) {
        case "notStarted":
          return "Non commencé";
        case "inProgress":
          return "En cours";
        case "finished":
          return "En attente de validation";
        case "validated":
          return "Validé";
        case "refused":
          return "Refusé";
        default:
          return "État inconnu";
      }
    },
    getActivity(activityId) {
      // TODO: get activity by id
      return { id: activityId, nom: "Nom générique" };
    },
    getCurrentActivity() {
      return this.getActivity(this.currentProgression.id);
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
    getParcoursName() {
      return itineraryHelpers.getParcoursName(this.idParcours);
    },
    changeParcoursColor() {
      return itineraryHelpers.getItineraryColor(this.idParcours);
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
