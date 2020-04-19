<template>
  <div>
    <div class="input-group mb-3">
      <div class="custom-file">
        <input
          ref="file"
          type="file"
          class="custom-file-input"
          id="file"
          v-on:change="loadFilename()"
        />
        <label class="custom-file-label" for="file" id="labelInput">
          <span v-if="!entry.documents || !entry.documents.length ">Choisis un fichier</span>
          <span v-else>{{ entry.documents.length }} fichier(s) rendu(s)</span>
        </label>
      </div>
      <div class="input-group-append">
        <button
          :id="`submitFileButton-${idEntry}`"
          class="input-group-text btn-primary text-white"
          v-on:click="submitFile()"
        >
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          Charger
        </button>
      </div>
    </div>
    <span>Une fois ton fichier sélectionné, clique sur Charger !</span>
    <span v-if="entry.documents && entry.documents.length"
      >{{ entry.documents.length }} fichier(s) rendu(s)</span
    >
    <Alert ref="alert" :show="showDismissibleAlert" :text="textAlert" />
  </div>
</template>

<script>
import FileService from "./../../../service/file.service";
import Alert from "./../../includes/Alert";
import $ from "jquery";

export default {
  name: "UploadFile",
  components: { Alert },
  props: ["entry", "updateEntry"],
  data() {
    return {
      idEntry: this.entry.id,
      file: "",
      showDismissibleAlert: false, // for Alert
      textAlert: false, // for Alert
      loading: false,
    };
  },
  methods: {
    loadFilename() {
      this.file = this.$refs.file.files[0];
      document.getElementById("labelInput").innerText = this.file.name;
    },
    /* Submits the file to the server */
    async submitFile() {
      if (!this.file) {
        return; // No file to load (and no error, no need a priori)
      }
      $(`#submitFileButton-${this.idEntry}`).prop("disabled", true);
      this.loading = true;
      let idFile = await FileService.pushFile(this.file);
      if (idFile == undefined) {
        this.entry.state = "INPROGRESS";
        alert(
          "Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?"
        );
        this.textAlert =
          "Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?";
        this.showDismissibleAlert = true;
        $(`#submitFileButton-${this.idEntry}`).removeAttr("disabled");
        this.loading = false;
        return;
      }
      try {
        this.entry.documents.push(idFile);
        let isSent = await this.updateEntry(this.entry);
        if (isSent) {
          alert("Nous avons bien reçu ton fichier !");
        } else {
          this.entry.state = "INPROGRESS";
          alert(
            "Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?"
          );
          this.textAlert =
            "Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?";
          this.showDismissibleAlert = true;
        }
      } finally {
        $(`#submitFileButton-${this.idEntry}`).removeAttr("disabled");
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.btn {
  word-wrap: break-word;
}
</style>
