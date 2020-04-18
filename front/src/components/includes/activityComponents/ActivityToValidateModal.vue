<template>
  <div class="container">
    <b-modal
      class="modal-backdrop"
      id="activityToValidateModal"
      :title="title"
      hide-backdrop
    >
      <div class="modal-body">
        Tu peux valider l'activité, la refuser ou la relire encore une fois !
        <ul>
          <li>Valider: l'activité du jeune sera officiellement validée !</li>
          <li>
            Refuser: l'activité sera refusée, mais le jeune pourra modifier son
            rendu et le soumettre à nouveau, s'il le souhaite
          </li>
        </ul>
        <br />
        <br />

        {{ message }}
      </div>
      <b-form-textarea
        class="form-control"
        v-model="progression.commentaire"
        placeholder="Entre ton commentaire ici !"
        id="exampleFormControlTextarea1"
        rows="3"
      >
        {{ progression.commentaire }}</b-form-textarea
      >
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          Relire l'activité
        </b-button>
        <b-button variant="danger" @click="refuse()">
          <span
            v-show="loadingRefuse"
            class="spinner-border spinner-border-sm"
          ></span>
          Refuser l'activité
        </b-button>
        <b-button variant="success" @click="accept()">
          <span
            v-show="loadingAccept"
            class="spinner-border spinner-border-sm"
          ></span>
          Accepter l'activité
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
  name: "ActivityToValidateModal",
  props: ["title", "message", "progression"],
  data() {
    return { loadingRefuse: false, loadingAccept: false };
  },
  methods: {
    async accept() {
      this.loadingAccept = true;
      await this.updateProgression("VALIDATED");
      this.loadingAccept = false;
    },
    async refuse() {
      this.loadingRefuse = true;

      await this.updateProgression("REFUSED");
      this.loadingRefuse = false;
    },

    async updateProgression(progressionState) {
      console.log("Editing progression...");
      //Change state
      this.progression.state = progressionState;

      // Update progression
      try {
        let response = await ProgressionService.updateProgression(
          this.progression,
          "user/progression"
        );
        if (!response) {
          throw "Impossible d'envoyer la progression !";
        }
        console.log("Progression sent: " + this.progression);

        // Redirect
        this.$router.push("/validation");
      } catch (error) {
        console.log("Error while sending text entry: " + this.progression);
        this.progression.state = "REVIEWING";
        alert(
          "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
        );
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
