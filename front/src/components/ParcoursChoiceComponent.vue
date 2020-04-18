<template>
  <div class="container">
    <h1>Choisis ton parcours</h1>
    <div class="row">
      <div class="col-md-3">
        <img
          @click="selectChoice(0)"
          src="@/assets/img/bosseEtBobo.png"
          alt="Bosses et bobos"
        />
      </div>
      <div class="col-md-3">
        <img
          @click="selectChoice(3)"
          src="@/assets/img/robinson.png"
          alt="Robinson"
        />
      </div>
      <div class="col-md-3">
        <img
          @click="selectChoice(2)"
          src="@/assets/img/cesArt.png"
          alt="Césart"
        />
      </div>
      <div class="col-md-3">
        <img
          @click="selectChoice(1)"
          src="@/assets/img/troisEtoiles.png"
          alt="Trois étoiles"
        />
      </div>
    </div>
    <ErrorModal :title="titleError" :message="messageError" />
  </div>
</template>

<script>
import Vue from "vue";
import VueRouter from "vue-router";
import ProgressionService from "../service/progression.service";
import ErrorModal from "./includes/ErrorModal";

Vue.use(VueRouter);

export default {
  name: "ParcoursChoiceComponent",
  components: { ErrorModal },
  data() {
    return {
      titleError: "Impossible de choisir le parcours",
      messageError:
        "Nous n'arrivons pas à sélectionner le parcours ! Vérifie ta connexion internet et réessaie !",
    };
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
      let isChosen = await ProgressionService.createProgression(
        parcoursFirstPrgression
      );
      if (isChosen === undefined) {
        console.warn("Impossible to send the Parcours to server!");
        this.$bvModal.show("errorModal");
      } else {
        // Store the Parcours and redirecte to activities
        this.$store.dispatch("parcours/setParcours", selected);
        this.$router.push("/activitees");
      }
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
