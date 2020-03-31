<template>
  <div>
    <b-modal
      class="modal-backdrop"
      id="activityModal"
      :title="activity.nom"
      hide-backdrop
    >
      <div class="modal-body">
        <p>Description: {{ activity.description }}</p>
        <p>Durée: {{ activity.duree }}</p>
        <p>Matériel: {{ activity.materiel }}</p>
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          Fermer
        </b-button>
        <form :action="'activite/' + activity.parcours + '/' + activity.id">
          <b-button variant="success" @click="ok()" type="submit">
            Démarrer l'activité
          </b-button>
        </form>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "ActivityModal",
  props: ["activity"]
};
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5 !important;
}
</style>
