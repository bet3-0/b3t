const activitySaved = JSON.parse(localStorage.getItem("activity")) || {};

// current activity
export const activity = {
  state: {
    activity: activitySaved
  },
  mutations: {
    set(state, test) {
      localStorage.setItem("activity", JSON.stringify(test));
      state.activity = test;
    }
  }
};
