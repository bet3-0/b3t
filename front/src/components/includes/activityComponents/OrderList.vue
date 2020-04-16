<template>
  <div class="container">
    <div class="row">
      <div
        class="col-md-6"
        style="display: flex; flex-direction: column; justify-content: center"
      >
        <h3>Remets dans l’ordre les étapes du lavage des mains</h3>
      </div>
      <div class="col-md-6" style="border-left: solid 1px lightgray">
        <draggable v-model="list" class="mb-5" ghost-class="ghost" :sort="true">
          <transition-group>
            <div v-for="element in list" :key="element" class="mb-3 cursor">
              {{ element }}
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="col-6" style="text-align: right">
        <button
          class="btn btn-primary"
          style="width: 80%"
          @click="submitText()"
        >
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import ProgressionService from "./../../../service/progression.service";

export default {
  name: "OrderList",
  components: {
    draggable
  },
  data() {
    return {
      list: []
    };
  },
  props: {
    updateEntry: {
      type: Function
    },
    entry: {
      type: Object
    }
  },
  mounted() {
    this.list = this.entry.rendu;
  },
  methods: {
    async submitText() {
      this.entry.state = "FINISHED";
      try {
        await ProgressionService.updateProgression(this.entry, "entry");
        console.log("Answer sent: " + this.entry.rendu);
        this.updateEntry(this.entry); // update the primary progression object
      } catch (error) {
        console.log("Error while sending text entry: " + this.entry.rendu);
        this.entry.state = "INPROGRESS";
        alert(
          "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
        );
      }
    }
  }
};
</script>

<style scoped>
.draggable {
  border: solid;
}

.cursor {
  cursor: grab;
  border-bottom: solid 1px lightgray;
}

.ghost {
  color: #0077b3;
  cursor: grabbing;
}
</style>
