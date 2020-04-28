<template>
  <div class="container" role="main">
    <AventureContent :idActivite="idActivite"/>
  </div>
</template>

<script>
import AventureContent from "./includes/activityComponents/AventureContent";

export default {
  name: "AventureComponent",
    components: {
      AventureContent,
  },
  props: [ "idActivite"],
  data() {},
  computed: {},
  created() {
    this.idActivite = this.$route.params.idActivite;
  },
  methods: {},
};
</script>

<style scoped></style>
