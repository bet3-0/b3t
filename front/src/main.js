import Vue from "vue";
import VueRouter from "vue-router";
import store from './store';
import HomePageComponent from "./components/HomePageComponent";
import LoginComponent from "./components/LoginComponent";
import ActivitiesComponent from "./components/ActivitiesComponent";
import ActivityComponent from "./components/ActivityComponent";
import App from "./App.vue";
import VeeValidate from 'vee-validate';
import "@/assets/css/main.css";
import ParcoursChoiceComponent from "./components/ParcoursChoiceComponent";
import PersonalProgression from "./components/PersonalProgression";
import ActivitiesToValidate from "./components/ActivitiesToValidate";

Vue.use(VeeValidate); // todo: understand this line for login ?
Vue.use(VueRouter);
Vue.config.productionTip = false;

Vue.filter('difficult', function (value) {
  switch (value) {
    case 0:
      return "Très facile";
    case 1:
      return "facile";
    case 2:
      return "Moyen";
    case 3:
      return "Difficile";
    default:
      return "Moyen"; // où mettre la halte ?
  }
})

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: HomePageComponent
    },
    {
      path: "/login",
      component: LoginComponent
    },
    {
      path: "/activitees",
      component: ActivitiesComponent
    },
    /*
    {
      // TO BE DEPRECATED !!!!
      path: "/activity/:idActivity",
      component: ActivityComponent
    },
    */
    {
      path: "/activity/:idParcours/:idActivite",
      component: ActivityComponent
    },
    {
      path: "/parcours",
      component: ParcoursChoiceComponent
    },
    {
      path: "/progression",
      component: PersonalProgression
    },
    {
      path: "/validation",
      component: ActivitiesToValidate
    }
  ]
});

new Vue({
  store,
  render: h => h(App),
  router,
}).$mount("#app");
