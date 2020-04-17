import { API_URL } from "./config";
import ProgressionService from "./progression.service";
import store from "./../store";

export default class activityService {
  // DEPRECATED
  /*
    static async getActivity(id) {
        return await fetch(`${API_URL}activity/id`, init);
    }
    */

  /**
  Get the file progrssion.json
  */
  static getProgression(idParcours, idActivite) {
    const progression = require("./../activities/" +
      idParcours +
      "/" +
      idActivite +
      "/progression.json");
    console.log(progression); // todo: remove
    return progression;
  }

  static async getAllActivity(idParcours) {
    try {
      let response = await fetch(`${API_URL}parcours`, { method: "GET" });
      let data = await response.json();
      let result = data.parcours[idParcours].Activites;
      return result;
    } catch (error) {
      return [];
    }
  }

  static async getActivity(idParcours, idActivite) {
    // First: check store ? (TODO ? )
    // Second: check localStorage
    let activities = JSON.parse(localStorage.getItem("activities")) || {};
    if (activities[idParcours] && activities[idParcours][idActivite]) {
      return activities[idParcours][idActivite];
    }
    activities = await this.getAllParcours();
    if (activities[idParcours] && activities[idParcours][idActivite]) {
      return activities[idParcours][idActivite];
    }
    console.error(
      "Could not retrieve the activity in DB with ids " +
        idParcours +
        "/" +
        idActivite
    );
    console.log("Using cached activity instead...");
    return require("./../activities/" +
      idParcours +
      "/" +
      idActivite +
      "/activity.json"); // for debug only
  }

  static async getAllParcours() {
    try {
      let response = await fetch(`${API_URL}parcours`, { method: "GET" });
      let data = await response.json();
      // data.parcours[idParcours].Activites -> {idParcours: {idActivity: {activity},...}, ...};
      let result = {};
      for (let index in data.parcours) {
        result[data.parcours[index].id] = {};
        for (let ind in data.parcours[index].Activites) {
          let activity = data.parcours[index].Activites[ind];
          result[data.parcours[index].id][activity.id] = activity;
        }
      }
      return result;
    } catch (error) {
      console.error(error);
      return {};
    }
  }
  static async getAllParcoursWithProgressions() {
    let activities = await this.getAllParcours(); // update activities
    let pastProgressions = await ProgressionService.getProgressions(); // get past progressions
    let gloabalProgression = 0;
    if (pastProgressions && pastProgressions.length) {
      pastProgressions.forEach((prog) => {
        if (
          ["FINISHED", "INREVIEW", "VALIDATED", "REFUSED"].includes(prog.state)
        ) {
          gloabalProgression += parseInt(prog.duration);
        }
        if (!(prog.idParcours in activities)) {
          activities[prog.idParcours] = {};
        }
        if (!(prog.idActivite in activities[prog.idParcours])) {
          activities[prog.idParcours][prog.idActivite] = {};
        }
        activities[prog.idParcours][prog.idActivite] = Object.assign(
          activities[prog.idParcours][prog.idActivite], // keep existing data
          {
            idParcours: prog.idParcours,
            id: prog.idActivite,
            progression: prog,
          }
        ); // everythong saved but only id is used
      });
    }
    // Get the Parcours
    if (pastProgressions && pastProgressions.length) {
      pastProgressions.sort((a, b) => a.startedAt - b.startedAt);
      store.dispatch("parcours/setParcours", pastProgressions[0].idParcours);
    }
    // store results in localStorage
    localStorage.setItem("activities", JSON.stringify(activities));
    store.dispatch("progression/setProgression", gloabalProgression);

    return activities;
  }
}
