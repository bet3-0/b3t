<template>
  <div hidden class="content-container">
    <!-- Placeholder content -->
    <ActivityContentSample />
    <!-- Activité -->
    <span v-html="activityContent"></span>
  </div>
</template>

<script>
// TODO: to be removed
import ActivityContentSample from "../placeholders/0";

export default {
  name: "ActivityContent",
  components: { ActivityContentSample }, // TODO: to be removed
  props: ["id"],
  data() {
    return {
      activityContent: "",
    };
  },
  created() {
    // TODO: fetch HTML content
    this.activityContent = "";
  },
  methods: {},
};
</script>
<style scoped></style>
