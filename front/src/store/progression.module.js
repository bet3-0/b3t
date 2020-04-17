const progressionSaved = parseInt(localStorage.getItem("progression")) || 0;

export const progression = {
  namespaced: true,
  state: {
    progression: progressionSaved, // initial stae
  },
  actions: {
    setProgression({ commit }, prog) {
      console.log("New progression: " + prog);
      commit("set", parseInt(prog));
      localStorage.setItem("progression", this.state.progression.progression);
    },
    updateProgression({ commit }, prog) {
      console.log("Progression updated: +" + prog);
      commit("update", parseInt(prog));
      localStorage.setItem("progression", this.state.progression.progression);
    },
  },
  mutations: {
    set(state, prog) {
      state.progression = Math.min(prog / 3, 100);
    },
    update(state, prog) {
      state.progression = Math.min(state.progression + prog / 3, 100);
    },
  },
};
