<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div
          class="form-group"
          v-for="(qcmObject, indexQcmObj) in entry.parsedRendu"
          :key="indexQcmObj"
        >
          <div class="form-label">
            <b>Question {{ indexQcmObj + 1 }} :</b>
            {{ qcmObject.question }}
          </div>
          <div
            class="form-check"
            v-for="(value, reponse, indexReponse) in qcmObject.reponses"
            :key="indexReponse"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :name="'q' + indexQcmObj"
              :id="'q' + indexQcmObj + 'r' + indexReponse"
              v-bind:value="qcmObject.reponses[reponse]"
              v-model="entry.parsedRendu[indexQcmObj].reponses[reponse]"
              :disabled="entry.state == 'INREVIEW'"
            />
            <label
              style="margin-left:1rem"
              class="form-check-label"
              :for="'q' + indexQcmObj + 'r' + indexReponse"
              >{{ reponse }}</label
            >
          </div>
        </div>
      </div>
      <br />

      <button class="btn btn-primary" type="button" v-on:click="submitText()" hidden>
        Envoyer mes réponses
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Qcm",
  props: ["entry", "updateEntry"],
  created() {
    // const regex = /'/gm;  // On peut avoir un apostrophe dans un texte, donc erreurs possibles avec remplacement de texte.
    const regex = /'/gm;
    var qcmQuestions = [];
    try {
      qcmQuestions = JSON.parse(this.entry.rendu);
    } catch (error) {
      qcmQuestions = JSON.parse(this.entry.rendu.replace(regex, '"'));
    }
    // this.qcmQuestions = qcmQuestions;
    this.entry.parsedRendu = qcmQuestions
    /*
    entry.rendu est de la forme:
    [{"question": "Ma question ?", "reponses": {"reponse1": false, "reponse2": false}}]
    */
  },
  methods: {
    // DEPRECATED
    async submitText() {
      this.entry.rendu = JSON.stringify(this.entry.parsedRendu);
      await this.updateEntry(this.entry); // update the primary progression object
    },
  },
};
</script>
<style scoped>
.form-group {
  text-align: left;
}

.input-group {
  margin: 1rem;
  display: flex;
}

.btn {
  word-wrap: break-word;
}
</style>
