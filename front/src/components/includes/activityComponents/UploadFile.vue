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
          @click="submitFile()"
          :disabled="buttonDisabled"
        >
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          Envoyer mon fichier
        </button>
      </div>
    </div>
    <span>Une fois ton fichier sélectionné, clique sur <i>Envoyer mon fichier</i> !</span>
    <br>
    <span v-if="entry.documents && entry.documents.length"
      >{{ entry.documents.length }} fichier(s) rendu(s){{filenames && ', dont : '}}{{ filenames }}</span
    >
    <Alert ref="alert" :show="showDismissibleAlert" :text="textAlert" />
  </div>
</template>

<script>
import FileService from "./../../../service/file.service";
import Alert from "./../../includes/Alert";

export default {
  name: "UploadFile",
  components: { Alert },
  props: ["entry", "updateEntry"],
  data() {
    return {
      role: this.$store.state.auth.user ? this.$store.state.auth.user.role : undefined,
      idEntry: this.entry.id,
      file: "",
      filenames: "",
      showDismissibleAlert: false, // for Alert
      textAlert: false, // for Alert
      loading: false,
      submissionAlreadyDone: false,
    };
  },
  computed:{
    buttonDisabled(){
      // Non-updatable state
      if (this.entry.state === 'REVIEWING' || this.role !=='jeune'){
        return true;
      }
      // File already uploading
      if (this.loading){
        return true;
      }
      // File selected has not changed since the last submission
      if (this.submissionAlreadyDone){
        return true;
      }
      return false;
    }
  },
  methods: {
    loadFilename() {
      this.file = this.$refs.file.files[0];
      document.getElementById("labelInput").innerText = this.file.name;
      this.submissionAlreadyDone = false;
    },
    /* Submits the file to the server */
    async submitFile() {
      this.showDismissibleAlert = false;
      if (!this.file) {
        return; // No file to load (and no error, no need a priori)
      }
      this.loading = true;
      let idFile = await FileService.pushFile(this.file);
      if (idFile === undefined) {
        this.entry.state = "INPROGRESS";
        alert(
          "Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?"
        );
        this.textAlert =
          "Nous n'avons pas pu envoyer ton fichier... Réessaie pour voir ?";
        this.showDismissibleAlert = true;
        this.loading = false;
        return;
      }
      try {
        this.entry.documents.push(idFile);
        let isSent = await this.updateEntry(this.entry);
        if (isSent) {
          alert("Nous avons bien reçu ton fichier !");
          this.filenames = this.filenames ? this.filenames + " / " : ""
          this.filenames = this.filenames + this.file.name;
          this.submissionAlreadyDone = true;
        } else {
          this.entry.state = "INPROGRESS";
          alert(
            "Nous n'avons pas pu envoyer correctement ton fichier... Réessaie pour voir ?"
          );
          this.textAlert =
            "Nous n'avons pas pu envoyer correctement ton fichier... Réessaie pour voir ?";
          this.showDismissibleAlert = true;
        }
      } finally {
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
.custom-file-input ~ .custom-file-label::after {
    content: "Parcourir";
}
</style>
