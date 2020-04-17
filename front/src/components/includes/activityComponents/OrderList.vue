<template>
  <div class="container">
    <div class="row">
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
          hidden
        >
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "OrderList",
  components: {
    draggable,
  },
  data() {
    return {
      list: [],
    };
  },
  props: {
    updateEntry: {
      type: Function,
    },
    entry: {
      type: Object,
    },
  },
  mounted() {
    const regex = /'/gm;
    var initQuestions = [];
    try {
      initQuestions = JSON.parse(this.entry.rendu);
    } catch (error) {
      initQuestions = JSON.parse(this.entry.rendu.replace(regex, '"'));
    }
    this.list = initQuestions;
  },
  methods: {
    async submitText() {
      this.entry.rendu = JSON.stringify(this.list);
      await this.updateEntry(this.entry); // update the primary progression object
    },
  },
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
