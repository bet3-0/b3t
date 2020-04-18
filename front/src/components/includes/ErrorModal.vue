<template>
  <div class="container">
    <b-modal class="modal-backdrop" id="errorModal" :title="title">
      <div class="modal-body">
        {{ message }}
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="warning" @click="reload()">
          Recharger la page
        </b-button>
        <b-button variant="secondary" @click="cancel()">
          Retourner sur la page pour réessayer
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
export default {
  name: "ValidationModal",
  props: ["title", "message"],
  methods: {
    reload() {
      window.location.reload();
    },
  },
};
</script>
