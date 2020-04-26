<template>
  <div class="container">
    <b-modal class="modal-backdrop" :id="`errorModal${idModal}`" :title="title">
      <div class="modal-body">
        {{ message }}
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="warning" @click="reload()">
          Recharger la page
        </b-button>
        <b-button variant="secondary" @click="cancel()">
          Retourner sur la page
        </b-button>
        <b-button v-if="link && linkMessage" variant="success" @click="go()">
          {{ linkMessage }}
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
  props: ["idError", "title", "message", "link", "linkMessage"],
  data(){
    return{
      idModal: this.idError || ""
    }
  },
  methods: {
    reload() {
      window.location.reload();
    },
    go(){
      if (this.link){
        this.$router.push(this.link)
      }
    }
  },
};
</script>
