<template>
  <div class="container">
    <button
      v-if="pageNumber > 1"
      class="btn btn-success"
      @click="previousPage()"
    >
      Précédent
    </button>
    <button class="btn btn-success" @click="validate()">
      {{ hasNext() ? "Page suivante" : "Valider" }}
    </button>
  </div>
</template>
<script>
export default {
  name: "ValidateActivityPage",
  props: ["activity", "pageNumber", "changePage"],
  data() {
    return {};
  },
  methods: {
    hasNext() {
      return this.pageNumber < this.activity.pages;
    },
    previousPage() {
      return this.changePage(this.pageNumber - 1);
    },
    nextPage() {
      return this.changePage(this.pageNumber + 1);
    },
    validate() {
      if (this.hasNext()) {
        this.nextPage();
      } else {
        // TODO
        console.log("validate");
        window.location.href = "/activitees"
      }
    },
  },
};
</script>
<style scoped>
.container {
  margin: 1rem;
  display: flex;
  justify-content: space-evenly;
}
</style>