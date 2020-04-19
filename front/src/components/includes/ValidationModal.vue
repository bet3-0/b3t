<template>
  <div class="container">
    <b-modal
      class="modal-backdrop"
      id="validationModal"
      title="Description de l'activité"
      hide-backdrop
    >
      <div class="modal-body">
        <p>Id : {{ progression.id }}</p>
        <p>Id activité : {{ progression.idActivite }}</p>
        <p>Parcours : {{ getParcoursName(progression.idParcours) }}</p>

        <p>
          Durée réelle:
          {{ getTimeDiff(progression.finishedAt, progression.startedAt) }}
          minutes
        </p>
        <p>Durée prévue: {{ progression.duration }} minutes</p>
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

Vue.use(VueRouter);
export default {
  name: "ValidationModal",
  props: ["progression"],
  methods: {
    go(progressionId) {
      console.log(progressionId);
      // TODO: create a specific route (depending on identifiant = BAD) ? Or everything on context
      this.$router.push("/validation/" + progressionId);
    },
    getParcoursName(idParcours) {
      return itineraryHelpers.getParcoursName(idParcours);
    },
    getTimeDiff(finishedAt, startedAt) {
      let finishedAtMs = finishedAt * 1000;
      let finishedAtDate = new Date(finishedAtMs);
      let startedAtMs = startedAt * 1000;
      let startedAtDate = new Date(startedAtMs);
      let diff = finishedAtDate - startedAtDate;
      return diff / 60000 || "inconnu";
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5 !important;
}
</style>
