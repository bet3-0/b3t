<template>
  <div>
    <a :id="`anchor-${idFile}`"
       class="btn btn-primary"
       :disabled="disabled"
       :href="fileUrl">
       Télécharger le fichier
    </a>
  </div>
</template>

<script>
import FileService from "./../../../service/file.service";

export default {
  name: "DownloadFile",
  data: function() {
     return {
        fileUrl: null,
        disabled: true
     };
  },
  props: ["idFile"],
  methods: {
    // Redirect user to file if file is available
  },
  async created() {
     this.fileUrl = await FileService.getUrl(this.idFile);
     if (this.fileUrl == undefined) {
        alert(
        "Impossible de récuperer ton fichier... Réessaie pour voir ?"
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
