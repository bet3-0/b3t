<template>
  <div class="container">
    <b-modal
      class="modal-backdrop"
      id="validationModal"
      :title="activity.nom"
      hide-backdrop
    >
      <div class="modal-body">
        <p>Id : {{ progression.id }}</p>
        <p>Id activité : {{ progression.idActivite }}</p>
        <p>Parcours : {{ getParcoursName(progression.idParcours) }}</p>

        <p>
          Durée réelle:
          {{
            ((progression.finishedAt - progression.startedAt) / 60000).toFixed(
              2
            )
          }}
          minutes
        </p>
        <p>Durée prévue: {{ activity.duree }} minutes</p>
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          Fermer
        </b-button>
        <b-button variant="success" @click.prevent.capture="go(progression.id+'/'+progression.idActivite+'/'+progression.idParcours)">
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
  data() {
    return {
      // TODO
      activity: {
        nom: "Nom de l'activité !",
        duree: "5",
        idActivité: 4,
        idParcours: 1,
      },
    };
  },
  methods: {
    go(progressionId) {
      console.log(progressionId);
      // TODO: create a specific route (depending on identifiant = BAD) ? Or everything on context
      this.$router.push("/validation/" + progressionId);
    },
    getParcoursName(idParcours) {
      return itineraryHelpers.getParcoursName(idParcours);
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5 !important;
}
</style>
