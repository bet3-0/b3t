<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="form-group" v-for="(question, indexQ) in tabQuestions" :key="indexQ">
          <div class="form-label">
            <b>Question {{indexQ + 1}} :</b>
            {{question.text}}
          </div>
          <div class="form-check" v-for="(proposition, indexP) in question.reponses" :key="indexP">
            <input
              class="form-check-input"
              type="checkbox"
              :name="'q' + indexQ"
              :id="'q' + indexQ + 'r' + indexP"
              v-bind:value="proposition.value"
              v-model="proposition.value"
            />
            <label class="form-check-label" :for="'q' + indexQ + 'r' + indexP">{{proposition.text}}</label>
          </div>
        </div>
      </div>
      <br />

      <button class="btn btn-primary" type="button" v-on:click="submitQcm()">Envoyer mes réponses</button>
    </div>
  </div>
</template>

<script>
import ProgressionService from "./../../../service/progression.service";

export default {
  name: "Qcm",
  props: ["entry", "updateEntry"],
  data() {
    return {
      tabQuestions: []
    };
  },
  created() {
    const regex = /'/gm;
    var initQuestions = JSON.parse(this.entry.rendu.replace(regex, '"'));
    
    for(var i = 0; i < initQuestions.length; i++) {
      this.tabQuestions.push({
        text: initQuestions[i].question,
        reponses: []
      })

      for(var j = 0; j < initQuestions[i].reponses.length; j++) {
        this.tabQuestions[i].reponses.push({
          text: initQuestions[i].reponses[j],
          value: false
        })
      }
    }

    console.log(initQuestions);
  },
  methods: {
    /* Formats and Submits the text to the server */
    async submitQcm() {
      var reponse = [];

      for (let i = 0; i < this.tabQuestions.length; i++) {
        reponse.push({
          text: this.tabQuestions[i].text,
          reponses: []
        })

        for(var j = 0; j < this.tabQuestions[i].reponses.length; j++) {
          if(this.tabQuestions[i].reponses[j].value) {
            reponse[i].reponses.push(this.tabQuestions[i].reponses[j].text)
          }
        }
        
      }
      reponse = JSON.stringify(reponse);
      this.entry.rendu = reponse;
      await this.submitText();      
    },
    async submitText() {
      this.entry.state = "FINISHED";
      try{
          await ProgressionService.updateProgression(this.entry);
          console.log("Answer sent: " + this.entry.rendu);
          this.updateEntry(this.entry); // update the primary progression object
        }
        catch(error){
          console.log("Error while sending text entry: "+ this.entry.rendu);
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
