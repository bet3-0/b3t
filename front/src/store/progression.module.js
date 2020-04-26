const progressionSaved = parseInt(localStorage.getItem("progression")) || 0;

export const progression = {
  namespaced: true,
  state: {
    globalProgression: progressionSaved, // initial state
  },
  actions: {
    setProgression({ commit }, prog) {
      commit("set", parseInt(prog));
      localStorage.setItem("progression", this.state.progression.globalProgression);
      console.log("Global progression: " + this.state.progression.globalProgression + ' %');
    },
  },
  mutations: {
    set(state, prog) {
      state.globalProgression = Math.min(prog, 100);
    },
  },
};
