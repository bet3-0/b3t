<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button
          class="input-group-text btn-primary text-white"
          v-on:click="submitFile()"
        >
          Charger
        </button>
      </div>
      <div class="custom-file">
        <input
          ref="file"
          type="file"
          class="custom-file-input"
          id="file"
          v-on:change="loadFilename()"
        />
        <label class="custom-file-label" for="file" id="labelInput">
          <span v-if="!entry.documents">Choisis un fichier</span>
          <span v-else>{{ entry.documents.length }} fichiers rendu(s)</span>
        </label>
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
      file: "",
    };
  },
  methods: {
    loadFilename() {
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

  async submitText() {
    this.entry.state = "FINISHED";
    try {
      await ProgressionService.updateProgression(this.entry, "entry");
      console.log("Answer sent: " + this.entry.rendu);
      this.updateEntry(this.entry); // update the primary progression object
    } catch (error) {
      console.log("Error while sending text entry: " + this.entry.rendu);
      this.entry.state = "INPROGRESS";
      alert(
        "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
      );
    }
  },
};
</script>
<style scoped>
.btn {
  word-wrap: break-word;
}
</style>
