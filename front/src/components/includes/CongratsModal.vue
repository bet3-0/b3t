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
        à toi d'utiliser et transmettre tout ce que tu as appris dans ta tribu !<br><br>
        Enfin, n'oublie pas de participer à <a href="/halte">la Halte</a> si tu ne l'as pas encore fait !
      </div>
      <img :src="require(`@/assets/img/${getParcoursImageName(idParcours)}`)"
           style="margin-left: auto; margin-right: auto; display: block; width: 70%;"/>
      <div>
        Si tu le souhaites, tu peux continuer à faire des activités de ce parcours ou des autres parcours.
        Ces activités bonus seront relues, mais ne seront pas prioritaires.
      </div>
    </div>
    <template v-slot:modal-footer="{ok, cancel}">
      <b-button @click="cancel()" variant="secondary">
        Retour
      </b-button>
      <a
        href="https://www.youtube.com/watch?v=7v-rEFvKf2k&list=PLR5Q4mdTpY45X31Lb98Fw0Ljh4CrOP_Hc&index=4&t=0s"
        rel="noopener noreferrer"
        target="_blank">
        <b-button
          variant="success">
          Voir la célébration de clôture
        </b-button>
      </a>
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