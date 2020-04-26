<template>
  <div class="container">
    <b-modal
      class="modal-backdrop"
      id="validationModal"
      title="Description de l'activité"
      hide-backdrop
    >
      <div class="modal-body">
        <p>Identifiant de progression : {{ progression.id }}</p>
        <p>Identifiant d'activité : {{ progression.idActivite }}</p>
        <p>Parcours : {{ getParcoursName(progression.idParcours) }}</p>
        <p>Durée prévue : {{ progression.duration }} minutes</p>
        <p>Date de début : {{ getDate(progression.startedAt) }}</p>
        <p v-if="progression.finishedAt">
          Date de fin : {{ getDate(progression.finishedAt) }}
        </p>
        <p v-if="progression.reviewdAt">
          Date de revue : {{ getDate(progression.reviewdAt) }}
        </p>
        <p>
          Durée réelle :
          {{ getTimeDiff(progression.finishedAt, progression.startedAt) }}
        </p>
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          Fermer
        </b-button>
        <b-button
          v-if="$store.state.auth.user && ['relecteur', 'admin'].includes($store.state.auth.user.role)"
          variant="success"
          @click.prevent.capture="go(progression)"
        >
          Vérifier l'activité
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import VueRouter from "vue-router";
import itineraryHelpers from "./../../service/itineraryHelpers";
import ProgressionHelpers from "./../../service/progressionHelpers";
import ProgressionService from "./../../service/progression.service";

Vue.use(VueRouter);
export default {
  name: "ValidationModal",
  props: ["progression"],
  methods: {
    async go(progression) {
      console.log("Validation of progression : " + progression.id);
      let updatedProgression = await ProgressionService.getUserProgression(progression.id)
      console.log(updatedProgression)
      if (progression.state === "REVIEWING"){
        // ok
        console.log("Already reviewing")
      } else if (!updatedProgression || !["FINISHED", "EXTRA"].includes(updatedProgression.state)){
        alert("Cette progression n'est plus disponible ! Rafraîchis ta page ;)")
        return;
      }
      console.log("OK")
      this.$router.push(
        "/validation/" +
          progression.id +
          "/" +
          progression.idParcours +
          "/" +
          progression.idActivite
      );
    },
    getParcoursName(idParcours) {
      return itineraryHelpers.getParcoursName(idParcours);
    },
    getTimeDiff: ProgressionHelpers.getTimeDiff,
    getDate: ProgressionHelpers.timestampToPrettyDate,
  },
};
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5 !important;
}
</style>
