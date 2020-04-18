<template>
  <div class="container">
    <h1>Choisis ton parcours</h1>
    <div class="row">
      <div class="col-md-3">
        <img
          @click="selectChoice(0)"
          src="@/assets/img/bosseEtBobo.png"
          alt=""
        />
      </div>
      <div class="col-md-3">
        <img @click="selectChoice(3)" src="@/assets/img/robinson.png" alt="" />
      </div>
      <div class="col-md-3">
        <img @click="selectChoice(2)" src="@/assets/img/cesArt.png" alt="" />
      </div>
      <div class="col-md-3">
        <img
          @click="selectChoice(1)"
          src="@/assets/img/troisEtoiles.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueRouter from "vue-router";
import ProgressionService from '../service/progression.service';

Vue.use(VueRouter);

export default {
  name: "ParcoursChoiceComponent",
  created() {
    // if user not logged in, redirect to /login
    if (!this.$store.state.auth.status.loggedIn) {
      return this.$router.push("/login");
    }
    // if a parcours has been chosen, redirect to /activitees
    if (this.$store.state.parcours.parcours < 4) {
      return this.$router.push("/activitees");
    }
  },
  methods: {
    async selectChoice(selected) {
      // Creates the first empty progression to permit to retrieve parcours after reconnection
      console.log("Parcours chosen:" + selected);
      let parcoursFirstPrgression = {
        state: "NOTSTARTED",
        idActivite: "-1",
        idParcours: JSON.stringify(parseInt(selected)),
        entries: [],
      };
      await ProgressionService.createProgression(parcoursFirstPrgression)
      this.$store.dispatch("parcours/setParcours", selected);
      this.$router.push("/activitees");
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}
.col-md-3 img {
  max-width: 100%;
  cursor: pointer;
}
</style>
