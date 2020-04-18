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
            <img class="icon" src="/img/icons/INPROGRESS.png" /> : Activité en
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
            <img class="icon" src="/img/icons/FINISHED.png" /> : Activité
            terminée, en cours de validation.
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter.FINISHED + counter.INREVIEW
          }}</span>
        </li>

        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <img class="icon" src="/img/icons/VALIDATED.png" /> : Activité
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
            <img class="icon" src="/img/icons/REFUSED.png" /> : Activitée
            refusée. Pas de panique, tu peux la recommencer si tu le souhaites !
          </div>
          <span class="badge badge-primary badge-pill">{{
            counter.REFUSED
          }}</span>
        </li>
      </ul>
    </div>

    <img
      v-if="!progressions || !progressions.length"
      class="img-spinner"
      src="/img/icons/spinner.svg"
      alt="Chargement en cours..."
    />
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
            <td>
              {{
                getActivityName(progression.idParcours, progression.idActivite)
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
  </div>
</template>

<script>
import ProgressionModal from "./includes/ProgressionModal";
import itineraryHelpers from "./../service/itineraryHelpers";
import progressionHelpers from "./../service/progressionHelpers";
import { VALID_STATES } from "./../service/progressionHelpers";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import ProgressionService from "./../service/progression.service";

Vue.use(BootstrapVue);
Vue.use(VueRouter);

export default {
  name: "PersonalProgression",
  components: { ProgressionModal },
  data() {
    return {
      idParcours: this.$store.state.parcours.parcours,
      currentProgression: {},
      progressions: [],
      counter: {
        NOTSTARTED: 0,
        INPROGRESS: 0,
        FINISHED: 0,
        INREVIEW: 0,
        VALIDATED: 0,
        REFUSED: 0,
      },
    };
  },
  created() {
    // if user not logged in, redirect to /login
    if (!this.$store.state.auth.status.loggedIn) {
      return this.$router.push("/login");
    }
    // Check if parcours is defined. If not, redirect to /parcours
    if (isNaN(this.idParcours) | (this.idParcours > 3)) {
      return this.$router.push("/parcours");
    }
  },
  async mounted() {
    let progressions = await ProgressionService.getProgressions();
    if (progressions) {
      // Show only progressions of the Parcours.
      this.progressions = progressions.filter(
        (prog) =>
          prog.idParcours == this.$store.state.parcours.parcours &&
          prog.state != "NOTSTARTED"  // NOTSTARTED est utilisée pour la toute première progression qui permet de définir le parcours
      );
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
  },

  methods: {
    getStateName: progressionHelpers.getStateName,
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
      this.progressions.forEach((progression) => {
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
