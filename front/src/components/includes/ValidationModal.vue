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
          Durée réelle : {{ getTimeDiff(progression.finishedAt, progression.startedAt) }}
        </p>
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          Fermer
        </b-button>
        <b-button
          v-if="['relecteur', 'admin'].includes($store.state.auth.user.role)"
          variant="success"
          @click.prevent.capture="
            go(
              progression.id +
                '/' +
                progression.idActivite +
                '/' +
                progression.idParcours
            )
          "
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

Vue.use(VueRouter);
export default {
  name: "ValidationModal",
  props: ["progression"],
  methods: {
    go(progressionId) {
      console.log("Validation of progression : " + progressionId);
      this.$router.push("/validation/" + progressionId);
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
