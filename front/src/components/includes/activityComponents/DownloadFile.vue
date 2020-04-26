<template>
  <b-card class="mb-1" header="Fichiers à télécharger">
    <Spinner :activated="!files.length"/>
    <a v-for="file in files"
       v-bind:key="file.id"
       :href="file.url"
       rel="noopener noreferrer"
       target="_blank">
      <b-button
        :id="`anchor-${file.id}`"
        :variant="`${file.variant}`"
        :disabled="file.disabled"
      >
        {{ file.text }}
      </b-button>
    </a>
  </b-card>
</template>

<script>
import FileService from "./../../../service/file.service";
import Spinner from "../Spinner";

export default {
  name: "DownloadFile",
  components: {Spinner},
  data: function() {
     return {
       files: [],
     };
  },
  props: ["fileIds"],
  methods: {
    // Redirect user to file if file is available
  },
  async created() {
    if (!this.fileIds || !this.fileIds.length) {
      this.files.push({
        id: -1,
        text: "Aucun fichier à télécharger",
        disabled: true,
        variant: "warning",
      })
      return
    }
    for (const fileId of this.fileIds) {
      let url = await FileService.getUrl(fileId);
      if (url === undefined) {
        this.files.push({
          id: fileId,
          text: "Fichier invalide",
          disabled: true,
          variant: "danger",
        })
      } else {
        this.files.push({
          id: fileId,
          text: "Télécharger le fichier",
          disabled: false,
          url: url,
          variant: "primary",
        })
      }
    }
  }
};
</script>
<style scoped>
.btn {
  word-wrap: break-word;
  margin: 0.1rem;
}

a {
  color: white;
}
</style>
