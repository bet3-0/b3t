<template>
  <div class="container mt-4">
    <h1 :style="'color:' + getParcoursColor(idParcours) + ' !important'">
      {{ getParcoursName(idParcours) }}
    </h1>
    <div class="row mb-5 mt-1">
      <div class="col-4" style="text-align: center">
        <button
          class="choice"
          @click.prevent.stop.capture="sortBy('alphabetical')"
        >
          Ordre alphabétique
        </button>
      </div>
      <div class="col-4" style="text-align: center">
        <button
          class="choice"
          @click.prevent.stop.capture="sortBy('duration')"
        >
          Classer par durée
        </button>
      </div>
      <div class="col-4" style="text-align: center">
        <button
          class="choice"
          @click.prevent.stop.capture="sortBy('difficulte')"
        >
          Classer par difficulté
        </button>
      </div>
    </div>

    <Spinner :activated="loading" />
    <div>
      <b-dropdown
        :text="currentParcoursName"
        class="m-md-2"
        id="dropdown-parcours"
        v-if="hasEnded"
        variant="primary"
      >
        <b-dropdown-item @click="filterParcours(4)">Tous les parcours</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="filterParcours(0)">Bosses et Bobos</b-dropdown-item>
        <b-dropdown-item @click="filterParcours(1)">Trois étoiles</b-dropdown-item>
        <b-dropdown-item @click="filterParcours(2)">Cés'Arts</b-dropdown-item>
        <b-dropdown-item @click="filterParcours(3)">Robinson</b-dropdown-item>
      </b-dropdown>
      <span v-if="startedIds && startedIds.length">
          Les activités que tu as commencées se trouvent sur la page
          <a href="/progression">Mes activités</a>.
        </span>
    </div>
    <!-- /#wrapper -->
    <div class="container">
      <table class="table">
        <thead v-if="!loading">
          <tr>
            <th scope="col"></th>
            <th scope="col">Nom</th>
            <th scope="col">Difficulté</th>
            <th scope="col">Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="activity in displayActivities"
            v-bind:key="activity.id + activity.idParcours"
            v-b-modal="'activityModal'"
            @click="sendInfo(activity)"
            :style="`cursor: pointer; color: ${getParcoursColor(activity.idParcours)}`"
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
            <td>{{ activity.nom }}</td>
            <td>{{ activity.difficulte }}</td>
            <td>{{ activity.duree }} min</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !displayActivities.length">
        Aucune activité à afficher.
      </div>
    </div>

    <!-- Modal -->
    <ActivityModal :activity="currentActivity" />
    <ErrorModal :title="titleError" :message="messageError" />
  </div>
</template>

<script>
  import ActivityModal from "./includes/ActivityModal";
  import activityService from "./../service/activity";
  import itineraryHelpers from "./../service/itineraryHelpers";
  import Vue from "vue";
  import BootstrapVue from "bootstrap-vue";
  import VueRouter from "vue-router";
  import Spinner from "./includes/Spinner";
  import ErrorModal from "./includes/ErrorModal";

  Vue.use(BootstrapVue);
Vue.use(VueRouter);

export default {
  name: "ActivitiesComponent",
  components: { ActivityModal, Spinner, ErrorModal },
  data() {
    return {
      idParcours: this.$store.state.parcours.parcours,
      currentParcoursName: "Filtrer par parcours",
      currentParcours : [this.$store.state.parcours.parcours.toString()],
      loading: true,
      startedIds: [],  // Ids of activities already started.
      sortKey: "",  // Sort options among: ["", "alphabetical", "duration", "difficulte"]
      currentActivity: {},
      activities: {}, // object {idActivite: {activity object}}
      titleError: "Erreur de chargement des activités",
      messageError: "",
    };
  },
  computed: {
    hasEnded(){
      return this.$store.state.progression.hasEnded;
    },
    displayActivities() { // list of displayed activities
      return this.sortActivities(
        Object.values(this.activities).filter(
          (activity) =>
            this.currentParcours.includes(activity.idParcours) &&
            !this.startedIds.includes(activity.id)
        ))
    }
  },
  created() {
    if (![0, 1, 2, 3].includes(this.$store.state.parcours.parcours)) {
      return this.$router.push("/parcours");
    }
  },
  async mounted() {
    await this.loadActivities();
  },
  methods: {
    sendInfo(activity) {
      // Send info for the modal
      this.currentActivity = activity;
    },
    async loadActivities() {
      this.loading = true;
      let activities = await activityService.getAllActivities();
      if (activities === undefined) {
        this.titleError = "Impossible de charger le contenu !";
        this.messageError =
          "Les activités n'arrivent pas à transiter jusqu'ici ! Recharge la page ou essaie de te déconnecter/reconnecter !";
        this.$bvModal.show("errorModal");
        this.loading = false;
        return undefined;
      }
      this.activities = activities;
      // Filter in case API does not
      let startedActivities = {};
      try {
        startedActivities =
          JSON.parse(localStorage.getItem("activities")) || {};
      } catch (error) {
        // localStorage corrupted
        this.titleError = "Impossible de charger le contenu !";
        this.messageError =
          "Les activités ont un souci pour venir jusqu'ici ! Essaie de te déconnecter/reconnecter pour régler le problème !";
        this.$bvModal.show("errorModal");
        this.loading = false;
        return undefined;
      }
      let startedIds = [];
      if (startedActivities) {
        for (let idParcours in startedActivities)
          startedIds = startedIds.concat(
            Object.keys(startedActivities[idParcours]).filter(
              (idActivite) =>
                startedActivities[idParcours][idActivite].progression
            ));
      }
      this.startedIds = startedIds
      this.loading = false;
    },
    // Filters
    filterParcours(idParcours) {
      if (!this.$store.state.progression.hasEnded) {
        // Additional security (in theory useless)
        return
      }
      if (idParcours == 4) {
        this.currentParcoursName = "Tous les parcours";
        this.currentParcours = ["0", "1", "2", "3"]
      } else {
        this.currentParcoursName = this.getParcoursName(idParcours);
        this.currentParcours = [idParcours.toString()]
      }
    },
    sortBy(key) {
      this.sortKey = key;
    },
    sortActivities(activities) {
      const sortedDifficulties = {"facile": 0, "moyen": 1, "difficile": 2};
      switch (this.sortKey) {
        case "alphabetical":
          return activities.sort((item, other) => {
            return item.nom.localeCompare(other.nom)
          });
        case "difficulte":
          return activities.sort((item, other) => {
            return sortedDifficulties[item.difficulte] - sortedDifficulties[other.difficulte]
          });
        case "duration":
          return activities.sort((item, other) => {
            return item.duree - other.duree
          });
        default:
          return activities
      }
    },
    getParcoursName: itineraryHelpers.getParcoursName,
    getParcoursColor: itineraryHelpers.getItineraryColor,
  },
};
</script>

<style scoped>
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
