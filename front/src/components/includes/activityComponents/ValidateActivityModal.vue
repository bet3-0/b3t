<template>
  <div class="container">
    <b-modal
      class="modal-backdrop"
      id="validateActivityModal"
      :title="title"
      hide-backdrop
    >
      <div class="modal-body">
        Veux-tu envoyer ton activité ? Une fois envoyée, tu ne pourras plus
        revenir en arrière !
        <br />
        <br />

        {{ message }}
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          Reprendre mon activité
        </b-button>
        <b-button
          :variant="message ? 'warning' : 'success'"
          @click="validate()"
        >
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          Envoyer mon activité{{message ? ' quand même' : ''}}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import VueRouter from "vue-router";
import ProgressionService from "./../../../service/progression.service";

Vue.use(VueRouter);
export default {
  name: "ValidateActivityModal",
  props: ["title", "message", "progression"],
  data() {
    return { loading: false };
  },
  methods: {
    async validate() {
      await this.validateProgression();
    },

    async validateProgression() {
      // It is assumed role is jeune and not REVIEWING/VALIDATED
      console.log("Validating progression...");
      //Change state
      this.loading = true;
      this.progression.state = "FINISHED";

      // Update progression
      try {
        let response = await ProgressionService.updateProgression(
          this.progression,
          "progression"
        );
        if (!response) {
          throw "Impossible d'envoyer ta progression !";
        }
        console.log("Progression sent: " + this.progression);

        // update global progression only if it is in parcours
        // --> no more : progression = VALIDATED state
        /*
        if (
          this.progression.idParcours == this.$store.state.parcours.parcours
        ) {
          this.$store.dispatch(
            "progression/updateProgression",
            this.progression.duration || 0
          );
        }*/
        // Redirect
        this.loading = false;
        this.$router.push("/progression");
      } catch (error) {
        console.log("Error while sending text entry: " + this.progression);
        this.progression.state = "INPROGRESS";
        alert(
          "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
        );
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5 !important;
}
</style>
