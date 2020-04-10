<template>
  <div class="container" role="main">
        <h1>Halte</h1>
  </div>
</template>

<script>
import VueWordCloud from 'vuewordcloud';
 

export default {
  name: "HalteComponent",
    components: {
    [VueWordCloud.name]: VueWordCloud,
  },
  data() {
    return {
        progressions : []
    };
  },
  created() {
    // TODO: fetch all progressions of Halte (idParcours = 4)
    this.progressions = [];
  },
  methods: {
  }
};
</script>

<style scoped>

</style>
