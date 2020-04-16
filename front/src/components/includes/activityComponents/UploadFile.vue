<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
          <button class="input-group-text btn-primary text-white" v-on:click="submitFile()">Charger</button>
      </div>
      <div class="custom-file">
        <input
          ref="file"
          type="file"
          class="custom-file-input"
          id="file"
          v-on:change="loadFilename()"
        />
        <label class="custom-file-label" for="file" id="labelInput"
          >Choisis un fichier</label
        >
      </div>
    </div>
  </div>
</template>

<script>
import ProgressionService from "./../../../service/progression.service";

export default {
  name: "UploadFile",
  props: ["entry", "updateEntry"],
  data() {
    return {
      file: ""
    };
  },
  methods: {
    loadFilename() {
      this.file = this.$refs.file.files[0];
      document.getElementById("labelInput").innerText = this.file;
    },
    /* Submits the file to the server */
    async submitFile() {
      /* Iniitialize the form data */
      let formData = new FormData();

      /* Add the form data we need to submit */
      formData.append("file", this.file);

      let url = await ProgressionService.pushFile(formData);
      if (url == undefined){
        this.entry.state = "INPROGRESS"
        alert("Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?")
      }
      this.entry.rendu = url;
      this.updateEntry(this.entry);
    }
  }
};
</script>
<style scoped>
.btn {
  word-wrap: break-word;
}
</style>
