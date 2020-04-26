<template>
  <b-modal
    class="modal-backdrop"
    hide-backdrop
    id="endModal"
    title="Parcours terminé !"
  >
    <div class="modal-body">
      <div>
        Félicitations ! Tes activités ont été validées et tu viens
        donc de terminer le parcours <b>{{ getParcoursName(idParcours) }}</b> !
        <br><br>Tu es maintenant un éclaireur ou une éclaireuse de Tribu aguerri(e) :
        à toi maintenant d'utiliser et transmettre tout ce que tu as appris dans ta tribu !
      </div>
      <img :src="require(`@/assets/img/${getParcoursImageName(idParcours)}`)"
           style="margin-left: auto; margin-right: auto; display: block; width: 70%;"/>
      <div>
        Si tu le souhaites, tu peux continuer à faire des activités de ce parcours ou des autres parcours.
        Ces activités ne seront toutefois pas relues et tu ne les verras pas s'afficher sur cette page.
      </div>
    </div>
    <template v-slot:modal-footer="{ok, cancel}">
      <b-button @click="cancel()" variant="secondary">
        Retour
      </b-button>
      <b-button
        @click.prevent.capture="$router.push('/activitees')"
        variant="success">
        Voir toutes les activités
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  import itineraryHelpers from "../../service/itineraryHelpers";

  export default {
    name: "CongratsModal",
    props: ["idParcours"],
    methods: {
      getParcoursImageName() {
        return itineraryHelpers.getParcoursImageName(this.idParcours);
      },
      getParcoursName() {
        return itineraryHelpers.getParcoursName(this.idParcours);
      },
    }
  }
</script>

<style scoped>

</style>