// TO BE REPLACED BY WHAT VICTOR HAS DONE!

<template>
    <div class="container">
        <b-modal
                class="modal-backdrop"
                id="progressionModal"
                :title="activity.nom"
                hide-backdrop
        >
            <div class="modal-body">
                <p>Description: {{ activity.description }}</p>
                <p>Durée: {{ activity.duree }} minutes</p>
                <p>Matériel: </p>
                <ul>
                    <li v-for="mat in activity.materiel" v-bind:key="mat">{{ mat }}</li>
                </ul>
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
        name: "ProgressionModal",
        props: ["activity"],
      methods: {
          go(activityId) {
            console.log(activityId)
            this.$router.push('/activity/' + activityId)
          }
      }
    };
</script>

<style scoped>
    .modal-backdrop {
        opacity: 0.5 !important;
    }
</style>
