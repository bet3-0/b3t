import { API_URL } from "./config";
import ProgressionService from "./progression.service";
import store from "./../store";

export default class activityService {
  /**
  Get the file progression.json
  */
  static getProgression(idParcours, idActivite) {
    // Returns Any (in general a JS Object)
    try {
      const progression = require("./../activities/" +
        idParcours +
        "/" +
        idActivite +
        "/progression.json");
      return progression;
    } catch (error) {
      console.log("Progression file not found!");
      console.error(error);
      return undefined;
    }
  }

  // TODO: DEPRECATE THIS --> getAllParcours()
  /**Get all activities associated tout a Parcours */
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
    // Returns Any (in general a JS Object)
    // 1) Check localStorage
    let activities;
    try {
      activities = JSON.parse(localStorage.getItem("activities")) || {};
    } catch (error) {
      // Corrupted localStorage (JSON.parse error)
      activities = {};
    }
    if (activities[idParcours] && activities[idParcours][idActivite]) {
      return activities[idParcours][idActivite]; // No garanty of a correct object (could be undefined)
    }
    // 2) Download activities from back
    activities = await this.getAllParcours();
    if (
      activities &&
      activities[idParcours] &&
      activities[idParcours][idActivite]
    ) {
      return activities[idParcours][idActivite];
    }
    // 3) Error!
    console.error(
      "Could not retrieve the activity in DB with ids " +
        idParcours +
        "/" +
        idActivite
    );

    // TODO : Remove this part or let it ?
    console.log("Using cached activity instead...");
    try {
      return require("./../activities/" +
        idParcours +
        "/" +
        idActivite +
        "/activity.json"); // WARN: not recommended!
    } catch (error) {
      console.log("Activity file not found!");
      console.error(error);
      return undefined;
    }
  }

  static async getAllParcours() {
    // Returns a Javascript Object or undefined
    try {
      let response = await fetch(API_URL + "parcours", { method: "GET" });
      let data = await response.json();
      // data.parcours[idParcours].Activites -> {idParcours: {idActivity: {activity},...}, ...};
      let result = {};
      for (let index in data.parcours) {
        result[data.parcours[index].id] = {};
        for (let ind in data.parcours[index].Activites) {
          let activity = data.parcours[index].Activites[ind]; // no check on the object
          result[data.parcours[index].id][activity.id] = activity;
        }
      }
      return result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**Get all activities linked to progressions */
  static async getAllParcoursWithProgressions() {
    // Update activities
    let activities = await this.getAllParcours();
    if (activities === undefined) {
      console.error("Activities could not be loaded !");
      return undefined;
    }
    // Get past progressions
    let pastProgressions = await ProgressionService.getProgressions();
    if (pastProgressions === undefined) {
      console.error("Progressions could not be loaded !");
      return undefined;
    }
    // Update the global progression and add a progression to activities
    let gloabalProgression = 0;
    pastProgressions.forEach((prog) => {
      // Update global progression if the activity is validated
      if (prog.state == "VALIDATED") {
        gloabalProgression += parseInt(prog.duration);
      }

      // add progression to corresponding activity
      if (!(prog.idParcours in activities)) {
        activities[prog.idParcours] = {};
      }
      if (!(prog.idActivite in activities[prog.idParcours])) {
        activities[prog.idParcours][prog.idActivite] = {};
      }
      // keep existing data of activities and add progression
      activities[prog.idParcours][prog.idActivite] = Object.assign(
        activities[prog.idParcours][prog.idActivite],
        {
          idParcours: prog.idParcours,
          id: prog.idActivite,
          progression: prog,
        }
      ); // everything saved but only id is used
    });

    // Get the Parcours = the idParcours from the first progression sent.
    pastProgressions
      .sort((a, b) => a.startedAt - b.startedAt)
      .filter((prog) => [0, 1, 2, 3].includes(parseInt(prog.idParcours)));
    if (pastProgressions.length) {
      // store the idParcours in store and localStorage
      store.dispatch("parcours/setParcours", pastProgressions[0].idParcours);
    }
    // store activities and global progression in localStorage
    localStorage.setItem("activities", JSON.stringify(activities));
    store.dispatch("progression/setProgression", gloabalProgression);

    return activities;
  }
}
