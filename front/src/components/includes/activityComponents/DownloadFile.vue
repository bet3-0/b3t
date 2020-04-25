<template>
  <div>
    <a :id="`anchor-${idFile}`"
       class="btn btn-primary"
       :disabled="disabled"
       :href="fileUrl">
      {{ text }}
    </a>
  </div>
</template>

<script>
import FileService from "./../../../service/file.service";

export default {
  name: "DownloadFile",
  data: function() {
     return {
       text: "Télécharger le fichier",
       fileUrl: null,
       disabled: true
     };
  },
  props: ["idFile"],
  methods: {
    // Redirect user to file if file is available
  },
  async created() {
    if (!this.idFile) {
      this.text = "Aucun fichier à télécharger"
      return
    }
    this.fileUrl = await FileService.getUrl(this.idFile);
    if (this.fileUrl === undefined) {
      alert(
        "Impossible de récupérer le fichier joint !"
      );
    } else {
      this.disabled = false
    }
  }
};
</script>
<style scoped>
.btn {
  word-wrap: break-word;
}
</style>
