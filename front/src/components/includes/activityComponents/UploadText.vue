<template>
  <div class="input-group">
    <textarea
      class="form-control"
      placeholder="Écris ta réponse ici"
    ></textarea>
    <div class="input-group-append">
      <button class="btn btn-primary" type="button" v-on:click="submitText()">
        Envoyer mon résultat
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadText",
  props: ["activityId"],
  data() {
    return {
      text: ""
    };
  },
  methods: {
    /* Submits the text to the server */
    // TODO
    submitText() {
      console.log("Not Implemented");
      return {};
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
