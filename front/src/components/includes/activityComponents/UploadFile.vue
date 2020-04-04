<template>
<div>

  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text">Télécharger</span>
    </div>
    <div class="custom-file">
      <input type="file" class="custom-file-input" id="inputGroupFile01" v-on:change="loadFilename()">
      <label class="custom-file-label" for="inputGroupFile01" id="labelInput">Choisi un fichier</label>
    </div>
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

    loadFilename(){
      let fileName = document.getElementById('inputGroupFile01').files[0].name
      document.getElementById('labelInput').innerText = fileName
    },
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

  },
};
</script>
<style scoped>

.btn {
  word-wrap: break-word;
}
</style>
