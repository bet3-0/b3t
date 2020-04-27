const progressionSaved = parseInt(localStorage.getItem("progression")) || 0;
const hasEndedSaved = parseInt(localStorage.getItem("progression")) >= 100 || false;

export const progression = {
  namespaced: true,
  state: {
    globalProgression: progressionSaved, // initial state
    hasEnded: hasEndedSaved, // initial state
  },
  actions: {
    setProgression({commit}, prog) {
      commit("set", parseInt(prog));
      localStorage.setItem("progression", this.state.progression.globalProgression);
      console.log("Global progression: " + this.state.progression.globalProgression + ' %');
    },
  },
  mutations: {
    set(state, prog) {
      state.globalProgression = Math.min(prog, 100);
      state.hasEnded = state.globalProgression >= 100;
    },
  },
};
