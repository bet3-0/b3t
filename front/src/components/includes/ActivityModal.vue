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
                <b-button variant="success" @click.prevent.capture="go(activity.id)">
                    Démarrer l'activité
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  Vue.use(VueRouter)
    export default {
        name: "ActivityModal",
        props: ["activity"],
      methods: {
          go(activityId) {
            console.log(activityId)
            this.$router.push('/activitees/' + activityId)
          }
      }
    };
</script>

<style scoped>
    .modal-backdrop {
        opacity: 0.5 !important;
    }
</style>
