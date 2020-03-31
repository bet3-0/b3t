<template>
  <div class="container">
    <div id="wrapper" class="toggled">
      <!-- Sidebar: TODO -->
      <div id="sidebar-wrapper">
        <ul class="sidebar-nav">
          <li class="sidebar-brand">
            <a href="#">Parcours {{ getParcoursName(idParcours) }} </a>
          </li>
          <li><a href="#">Classer par durée</a></li>
          <li><a href="#">Classer par difficulté</a></li>
          <li><a href="#">Activités rouges</a></li>
        </ul>
      </div>
      <!-- /#sidebar-wrapper -->
    </div>
    <!-- /#wrapper -->
    <div class="container">
      <ul id="activities" class="list-group" style="margin-top: 10%">
        <li
          class="list-group-item"
          v-for="activity in activities"
          :key="activity.id"
          :style="'background:' + getParcoursColor(activity.idParcours)"
        >
          <a href="#" v-b-modal="'activityModal'" @click="sendInfo(activity)">
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
            <p style="display: inline">{{ activity.nom }}</p>
            <p
              style="display: inline-block; position: absolute; right: 0; margin-right: 5px"
              class="justify-content-end"
            >
              Durée : {{ activity.duree }}
            </p>
          </a>
        </li>
      </ul>
    </div>

    <!-- Modal -->
    <ActivityModal :activity="currentActivity" />
  </div>
</template>

<script>
import ActivityModal from "./includes/ActivityModal";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);

export default {
  name: "ActivitiesComponent",
  components: { ActivityModal },
  props: ["idParcours"],
  data() {
    return {
      currentActivity: {},
      activities: [
        {
          id: 0,
          idParcours: 0,
          nom: "Learn JavaScript",
          description: "c'est bien",
          duree: "5h",
          materiel: "plein"
        },
        { id: 1, idParcours: 0, nom: "Learn Vue", duree: "5h" },
        { id: 2, idParcours: 1, nom: "Build something awesome", duree: "5h" }
      ]
    };
  },
  methods: {
    sendInfo(activity) {
      this.currentActivity = activity;
    },

    // Mettre ça dans un dossier commun:
    getParcoursColor(idParcours) {
      switch (idParcours) {
        case 0:
          return "#ff8300";
        case 1:
          return "#d03f15";
        case 2:
          return "#6e74aa";
        case 3:
          return "#0072540";
        default:
          return "#003a5d";
      }
    },
    getParcoursName(idParcours) {
      switch (idParcours) {
        case 0:
          return "Bosses et Bobos";
        case 1:
          return "Trois étoiles";
        case 2:
          return "Cés'Art";
        case 3:
          return "Robinson";
        default:
          return "La Halte"; // où mettre la halte ?
      }
    }
  }
};
</script>

<style scoped></style>
