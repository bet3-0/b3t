<template>
    <div class="container">
        <b-modal
                class="modal-backdrop"
                id="activityModal"
                :title="activity.nom"
                hide-backdrop
        >
            <div class="modal-body">
                <p>Description: {{ activity.description }}</p>
                <p>Durée: {{ activity.duree }} minutes</p>
                <p v-if="
                    activity.materiel &&
                      activity.materiel.length &&
                      activity.materiel[0].length
                  ">Matériel: </p>
                <ul v-if="
                    activity.materiel &&
                      activity.materiel.length &&
                      activity.materiel[0].length
                  ">
                    <li v-for="mat in activity.materiel" v-bind:key="mat">{{ mat }}</li>
                </ul>
            </div>
            <template v-slot:modal-footer="{ ok, cancel }">
                <b-button variant="secondary" @click="cancel()">
                    Fermer
                </b-button>
                <b-button variant="success" @click.prevent.capture="go(activity)">
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
          go(activity) {
            console.log(activity)
            this.$store.commit('set', activity)
            this.$router.push('/activity/' + activity.id)
          }
      }
    };
</script>

<style scoped>
    .modal-backdrop {
        opacity: 0.5 !important;
    }
</style>
