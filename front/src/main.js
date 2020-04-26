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
import PoliciesComponent from "./components/PoliciesComponent"
import Error404 from "./components/Error404";
import FrozenActivity from "./components/FrozenActivity";


Vue.use(VeeValidate); // todo: understand this line for login ?
Vue.use(VueRouter);
Vue.config.productionTip = false;

Vue.filter("difficult", function (value) {
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
      path: "/policies",
      component: PoliciesComponent,
    },
    {
      path: "/activitees",
      get component() {
        return ActivitiesComponent;
      },
    },
    {
      path: "/activity/:idParcours/:idActivite",
      get component() {
        return ActivityComponent;
      },
    },
    {
      path: "/parcours",
      get component() {
        return ParcoursChoiceComponent;
      },
    },
    {
      path: "/progression",
      get component() {
        return PersonalProgression;
      },
    },
    {
      path: "/validation",
      get component() {
        return ActivitiesToValidate;
      },
    },
    {
      path: "/youth",
      redirect() {
        if (!store.state.auth.user) {
          return '/';
        }
        switch (store.state.auth.user.role) {
          case 'chef':
            return '/groupe';
          case 'ap':
            return '/territoire';
          default:
            return '/';
        }
      }
    },
    {
      path: "/groupe",
      get component() {
        return YouthActivities;
      },
    },
    {
      path: "/territoire",
      get component() {
        return YouthActivities;
      },
    },
    {
      path: "/halte",
      get component() {
        return HalteComponent;
      },
    },
    {
      path: "/validation/:idProgression/:idParcours/:idActivite",
      get component() {
        return ActivityToValidate;
      },
    },
    {
      path: "/apercu/:idProgression/:idParcours/:idActivite",
      get component() {
        return FrozenActivity;
      },
    },
    {
      path: "*",
      component: Error404,
    },
  ],
});
/*
router.beforeEach((to, from, next) => {
   if(!/^\/login/.test(to.fullPath) && !["/", "/policies"].includes(to.fullPath)) {
      if (!store.state.auth.status.loggedIn) {
         next({
            path: "/login",
            params: { nextUrl: to.fullPath }
         });
      } else {
         next();
      }
   } else {
      next();
   }
});
*/
new Vue({
  store,
  render: (h) => h(App),
  router,
}).$mount("#app");
