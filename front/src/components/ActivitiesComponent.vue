<template>
  <div class="container">
    <div id="wrapper" class="toggled choices-container">
      <!-- Sidebar: TODO -->
      <div id="sidebar-wrapper">
        <ul class="sidebar-nav choices">
          <li class="choice" >Parcours {{ getParcoursName(idParcours) }}</li>
          <li class="choice" >Classer par durée</li>
          <li class="choice" >Classer par difficulté</li>
          <li class="choice" >Activités rouges</li>
        </ul>
      </div>
      <!-- /#sidebar-wrapper -->
    </div>
    <!-- /#wrapper -->
    <div class="container">
      <ul id="activities" class="list-group">
        <li class="list-group-item" v-for="activity in orderActivities" :key="activity.id">
          <a href="#" v-b-modal="'activityModal'" @click="sendInfo(activity)">
            <svg class="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" style="display: inline">
              <path
                d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"
              />
            </svg>
            <p style="display: inline-block">{{ activity.nom }}</p>
            <p style="display: inline-block; margin-left: 3em" >{{getParcoursName(activity.idParcours)}}</p>
            <p
              style="display: inline-block; position: absolute; right: 0; margin-right: 5px"
              class="justify-content-end"
            >
              Durée : {{ activity.duree }} min
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
import VueRouter from "vue-router";

Vue.use(BootstrapVue);
Vue.use(VueRouter);

export default {
  name: "ActivitiesComponent",
  components: { ActivityModal },
  props: ["idParcours"],
  data() {
    return {
      currentActivity: {},
      activities: [
        {id: 0, idParcours: 0, nom: "Learn JavaScript", description: "c'est bien", duree: 22, materiel: "plein"},
        { id: 1, idParcours: 0, nom: "Learn Vue", duree: 25 },
        { id: 2, idParcours: 1, nom: "Build something awesome", duree: 20 }
      ],
      displayActivities: []
    };
  },
  mounted(){
    this.displayActivities = this.activities
  },
  methods: {
    sendInfo(activity) {
      this.currentActivity = activity;
    },

    orderActivities: function () {
      return _.orderBy(this.activities, 'duree')
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

<style scoped>
  .choices-container{
    margin-top: 3em;
  }

  .choices{
    display: flex;
    justify-content: space-evenly;
  }

  #activities p{
    margin: 0;
  }

  #activities p:first-of-type{
    width: 45%;
  }

  .choices li{
    list-style-type: none;
  }

  .choice{
    border: solid;
    cursor: pointer;
  }
</style>
