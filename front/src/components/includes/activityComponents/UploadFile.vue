<template>
  <div class="input-group">
    <div class="custom-file">
      <input
        type="file"
        class="custom-file-input"
        id="file"
        ref="file"
        v-on:change="handleFileUpload()"
      />
      <label class="custom-file-label" for="inputGroupFile"
        >Choisir un fichier</label
      >
    </div>
    <div class="input-group-append">
      <button class="btn btn-primary" type="button" v-on:click="submitFile()">
        Envoyer mon résultat
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: ["activityId", "entryId", "changeEntryState"],
  data() {
    return {
      file: "",
    };
  },
  methods: {
    /* Submits the file to the server */
    submitFile() {
      /* Iniitialize the form data */
      let formData = new FormData();

      /* Add the form data we need to submit */
      formData.append("file", this.file);

      /* Make the request to the POST /single-file URL */
      // TODO
      console.log("Not Implemented");
      /*
      axios.post("/single-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      */
      this.changeEntryState(this.entryId, "finished");
    },

    /* Handles a change on the file upload */
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
  },
};
</script>
<style scoped>
.input-group > .custom-file {
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
