import {API_URL} from "./config";
import ProgressionService from "./progression.service";
import store from "./../store";

export default class activityService {
  /**
   Get the file progression.json
   */
  static getProgression(idParcours, idActivite) {
    // Returns Any (in general a JS Object)
    try {
      return require("./../activities/" +
        idParcours +
        "/" +
        idActivite +
        "/progression.json");
    } catch (error) {
      console.log("Progression file not found!");
      console.error(error);
      return undefined;
    }
  }

  /** Get all activities associated tout a Parcours */
  static async getAllActivities(idParcours) {
    let allParcours = await this.getAllParcours();
    if (allParcours === undefined) {
      return undefined;
    }
    return allParcours[idParcours];
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
      return activities[idParcours][idActivite]; // No guaranty of a correct object (could be undefined)
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
      let response = await fetch(API_URL + "parcours", {method: "GET"});
      let data = await response.json();
      // data.parcours[idParcours].Activites -> {idParcours: {idActivity: {activity},...}, ...};
      let parcours = {};
      for (let index in data.parcours) {
        parcours[data.parcours[index].id] = {};
        for (let ind in data.parcours[index].Activites) {
          let activity = data.parcours[index].Activites[ind]; // no check on the object
          parcours[data.parcours[index].id][activity.id] = activity;
        }
      }
      return parcours;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static getGlobalProgressionFromProgressions(progressions) {
    if (!progressions) {
      return 0
    }
    let globalProgression = 0;
    progressions.forEach((prog) => {
      // Update global progression if the activity is validated
      if (prog.state === "VALIDATED") {
        globalProgression += parseInt(prog.duration);
      }
    })
    return Math.min(globalProgression / 3, 100);  // Convert duration in % (5h = 300min = 100%)
  }

  static getParcoursFromProgressions(progressions) {
    if (!progressions) {
      return undefined
    }
    const parcoursProgressions = progressions
      .sort((a, b) => a.startedAt - b.startedAt)
      .filter((prog) => [0, 1, 2, 3].includes(parseInt(prog.idParcours)));
    if (parcoursProgressions.length) {
      return parcoursProgressions[0].idParcours
    } else {
      return undefined
    }
  }

  /**Get all activities linked to progressions */
  static async getAllParcoursWithProgressions() {
    console.log("Updating all activities and progresssions...");
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
    const globalProgression = this.getGlobalProgressionFromProgressions(pastProgressions);

    pastProgressions.forEach((prog) => {
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
    const parcours = this.getParcoursFromProgressions(pastProgressions)
    if (parcours !== undefined) {
      store.dispatch("parcours/setParcours", parcours);
    }
    // store activities and global progression in localStorage
    localStorage.setItem("activities", JSON.stringify(activities));
    store.dispatch("progression/setProgression", globalProgression);

    return activities;
  }
}
