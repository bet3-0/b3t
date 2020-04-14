<template>
  <div class="row">
    <div class="form-group col-sm-12">
      <b-form-textarea
        class="form-control"
        v-model="entry.rendu"
        placeholder="Entre ta réponse ici !"
        id="exampleFormControlTextarea1"
        rows="3"
        style=""
      >
        {{ entry.rendu }}</b-form-textarea
      >
    </div>
    <button class="btn btn-primary" type="button" v-on:click="submitText()">
      Envoyer mon résultat
    </button>
  </div>
</template>

<script>
import ProgressionService from "./../../../service/progression.service";

export default {
  name: "UploadText",
  props: ["entry", "updateEntry"],
  methods: {
    /* Submits the text to the server */
    async submitText() {
      this.entry.state = "FINISHED";
      try{
          await ProgressionService.updateProgression(this.entry);
          console.log("Answer sent: " + this.entry.rendu);
          this.updateEntry(this.entry); // update the primary progression object
        }
        catch(error){
          console.log("Error while sending text entry: "+ this.entry.rendu);
          this.entry.state = "INPROGRESS";
          alert(
            "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
          );
        }
    }
  }
};
</script>
<style scoped>
.input-group > textarea {
  display: flex;
  flex-basis: content;
  flex-grow: 0;
  flex-shrink: 1;
}

.input-group {
  margin: 1rem;
  display: flex;
}

.btn {
  word-wrap: break-word;
}
</style>
