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
        :disabled="['REVIEWING', 'VALIDATED'].includes(entry.state)"
      >
        {{ entry.rendu }}</b-form-textarea
      >
    </div>
    <button class="btn btn-primary" type="button" v-on:click="submitText()" hidden>
      Envoyer mon résultat
    </button>
  </div>
</template>

<script>
export default {
  name: "UploadText",
  props: ["entry", "updateEntry"],
  methods: {
    /* Submits the text to the server */
    async submitText() {
      await this.updateEntry(this.entry); // update the primary progression object
    },
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
