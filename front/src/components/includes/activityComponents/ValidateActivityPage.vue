<template>
  <button class="btn btn-success" @click="validate()">
    {{ hasNext() ? "Page suivante" : "Valider" }}
  </button>
</template>
<script>
export default {
  name: "ValidateActivityPage",
  props: ["activity", "pageNumber"],
  data() {
    return {};
  },
  methods: {
    hasNext() {
      return this.pageNumber < this.activity.pages;
    },
    nextPage() {
      return this.pageNumber + 1;
    },
    validate() {
      //TODO
      console.log("Not Implemented");
      if (this.hasNext()) {
        window.location.href = "/";
      } else {
        window.location.href = "/login";
      }
    }
  }
};
</script>
