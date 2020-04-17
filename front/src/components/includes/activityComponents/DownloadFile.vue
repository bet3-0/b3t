<template>
  <div>
    <button :id="`anchor-${idFile}`" v-on:click="redirectToFIle()" class="btn btn-primary">Télécharger le fichier</button>
  </div>
</template>

<script>
import FileService from "./../../../service/file.service";

export default {
  name: "DownloadFile",
  data() {},
  props: ["idFile"],
  methods: {
    // Redirect user to file if file is available
    async redirectToFIle() {
      let url = await FileService.getUrl(this.idFile);
      if (url == undefined) {
        alert(
          "Impossible de récuperer ton fichier... Réessaie pour voir ?"
        );
        return
      }
      window.open(url, '_blank').focus();
      return
    },
  },
};
</script>
<style scoped>
.btn {
  word-wrap: break-word;
}
</style>
