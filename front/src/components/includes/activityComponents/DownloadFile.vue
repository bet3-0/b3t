<template>
  <div>
    <a>
      <svg class="bi bi-file-arrow-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M4 1h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V3a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1H4z" clip-rule="evenodd"/>
      <path fill-rule="evenodd" d="M4.646 8.146a.5.5 0 01.708 0L8 10.793l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/>
      <path fill-rule="evenodd" d="M8 4a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6A.5.5 0 018 4z" clip-rule="evenodd"/>
      </svg>
    <a>
  </div>
</template>

<script>
import ProgressionService from "./../../../service/progression.service";

export default {
  name: "DownloadFile",
  props: ["entry", "updateEntry"],
  data() {
    return {
      file: "",
    };
  },
  methods: {
    loadFile() {
      this.file = this.$refs.file.files[0];
      document.getElementById("labelInput").innerText = this.file.name;
    },
    /* Submits the file to the server */
    async submitFile() {
      /* Iniitialize the form data */
      let formData = new FormData();

      /* Add the form data we need to submit */
      formData.append("file", this.file);

      let url = await ProgressionService.pushFile(formData);
      if (url == undefined) {
        this.entry.state = "INPROGRESS";
        alert(
          "Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?"
        );
      }
      this.entry.documents.push(url);
      this.updateEntry(this.entry);
      await this.submitText(); // Send the entry
    },
  },
};
</script>
<style scoped>
.btn {
  word-wrap: break-word;
}
</style>
