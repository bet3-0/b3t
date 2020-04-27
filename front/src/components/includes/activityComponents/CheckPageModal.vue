<template>
  <b-modal
    class="modal-backdrop"
    :id="modalId"
    title="Certains éléments ne sont pas complets..."
  >
    <div class="modal-body">
      {{checkText}} <br><br>
      Souhaites-tu continuer ou revenir à la page pour vérifier son contenu ?
    </div>
    <template v-slot:modal-footer="{ok, cancel}">
      <b-button variant="secondary" @click="cancel()">
        Revenir à la page
      </b-button>
      <b-button
        variant="success"
        @click.prevent.capture="checkCallback()"
      >
        Confirmer
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  export default {
    name: "CheckPageModal",
    props: {
      "modalId":{
        type: String
      },
      "checkText": {
        type: String
      },
      "checkCallback": {
        type: Function
      }
    }
  }
</script>

<style scoped>

</style>