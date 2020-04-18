import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
import HomePageComponent from "./components/HomePageComponent";
import LoginComponent from "./components/LoginComponent";
import ActivitiesComponent from "./components/ActivitiesComponent";
import ActivityComponent from "./components/ActivityComponent";
import App from "./App.vue";
import VeeValidate from "vee-validate";
import "@/assets/css/main.css";
import ParcoursChoiceComponent from "./components/ParcoursChoiceComponent";
import PersonalProgression from "./components/PersonalProgression";
import ActivitiesToValidate from "./components/ActivitiesToValidate";
import HalteComponent from "./components/HalteComponent";
import ActivityToValidate from "./components/ActivityToValidate";
import YouthActivities from "./components/YouthActivities";

Vue.use(VeeValidate); // todo: understand this line for login ?
Vue.use(VueRouter);
Vue.config.productionTip = false;

Vue.filter("difficult", function(value) {
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
});

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: HomePageComponent,
    },
    {
      path: "/login",
      component: LoginComponent,
    },
    {
      path: "/activitees",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return ActivitiesComponent;
      },
    },
    {
      path: "/activity/:idParcours/:idActivite",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return ActivityComponent;
      },
    },
    {
      path: "/parcours",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return ParcoursChoiceComponent;
      },
    },
    {
      path: "/progression",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return PersonalProgression;
      },
    },
    {
      path: "/validation",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return ActivitiesToValidate;
      },
    },
    {
      path: "/youth",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return YouthActivities;
      },
    },
    {
      path: "/halte",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return HalteComponent;
      },
    },
    {
      path: "/validation/:idProgression/:idParcours/:idActivite",
      get component() {
        if (!store.state.auth.status.loggedIn) {
          return LoginComponent;
        }
        return ActivityToValidate;
      },
    },
  ],
});

new Vue({
  store,
  render: (h) => h(App),
  router,
}).$mount("#app");
