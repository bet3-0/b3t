<template>
  <div class="container">
    <div id="wrapper" class="toggled choices-container">
      <!-- Sidebar: TODO -->
      <div id="sidebar-wrapper">
        <ul class="sidebar-nav choices">
        <!-- <li class="choice" @click.prevent.stop.capture="change('parcours')" :class="parcours">Parcours {{ getParcoursName(idParcours) }}</li> -->

          <li class="choice" @click.prevent.stop.capture="change('parcours')" :class="parcours">Ordre alpabetique</li>
          <li class="choice" @click.prevent.stop.capture="change('duration')" :class="duration">Classer par durée</li>
          <li class="choice" @click.prevent.stop.capture="change('difficult')" :class="difficult">Classer par difficulté</li>
          <li class="choice" @click.prevent.stop.capture="change('red')" :class="red">Activités rouges</li>
        </ul>
      </div>
      <!-- /#sidebar-wrapper -->
    </div>
    <!-- /#wrapper -->
    <div class="container">
      <ul id="activities" class="list-group">
        <li class="list-group-item" v-for="activity in displayActivities" :key="activity.id">
          <a href="#" v-b-modal="'activityModal'" @click="sendInfo(activity)">
            <svg class="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" style="display: inline">
              <path
                d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"
              />
            </svg>
            <p style="display: inline-block">{{ activity.nom }}</p>
            <p style="display: inline-block; margin-left: 3em" >{{getParcoursName(activity.idParcours)}}</p>
            <p style="display: inline-block">{{activity.difficult | difficult}}</p>
            <p style="display: inline-block; position: absolute; right: 0; margin-right: 5px" class="justify-content-end">
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
      parcours: '',
      duration: '',
      difficult: '',
      red: '',
      currentActivity: {},
      activities: [
        {id: 0, difficult: 3, idParcours: 0, nom: "Learn JavaScript", description: "c'est bien", duree: 22, materiel: "plein"},
        { id: 1, difficult: 2, idParcours: 0, nom: "Learn Vue", duree: 25 },
        { id: 2, difficult: 1, idParcours: 1, nom: "Build something awesome", duree: 27 }
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

    change(data){
      if (data === 'parcours'){
          this.displayActivities = this.activities
          this.displayActivities.sort(function (item, other) {
            if(item.nom < other.nom) { return -1; }
            if(item.nom > other.nom) { return 1; }
          })
        }


      if (data === 'difficult') {
        this.displayActivities = this.activities
        this.displayActivities.sort(function (item, other) {
          if (item.difficult < other.difficult) {
            return -1;
          }
          if (item.difficult > other.difficult) {
            return 1;
          }
        })
      }

      if (data === 'duration'){
          this.displayActivities = this.activities
          this.displayActivities.sort(function (item, other) {
            if(item.duree < other.duree) { return -1; }
            if(item.duree > other.duree) { return 1; }
          })
      }

      data === 'parcours' ? this[data] = this[data] === '' ? 'active' : '' : this.parcours = ''
      data === 'duration' ? this[data] = this[data] === '' ? 'active' : '' : this.duration = ''
      data === 'difficult' ? this[data] = this[data] === '' ? 'active' : '' : this.difficult = ''
      data === 'red' ? this[data] = this[data] === '' ? 'active' : '' : this.red = ''
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

  #activities p{
    width: 20%;
  }

  #activities p:first-of-type{
    width: 45%;
  }

  #activities p:last-of-type{
    text-align: right;
  }

  .choices li{
    list-style-type: none;
  }

  .choice{
    border: solid;
    cursor: pointer;
    padding: 1em;
    border-radius: 10px ;
    transition: background-color 0.3s,color 0.3s, border 0.3s;

  }

  .choice:hover{
    transform: translate(0, -10px);
  }

  .active{
    background-color: #0077b3;
    border: solid #0077b3;
    color: white;
  }

</style>
