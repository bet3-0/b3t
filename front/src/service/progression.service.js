/* This is an example file */
import authHeader from "./auth-header";
import {API_URL} from "./config";
import store from "../store";

export default class ProgressionService {
  /** Sends an empty progression to back to create a new progression
   */
  static async createProgression(data) {
    if (!store.state.auth.user || store.state.auth.user.role != "jeune") {
      // Only a jeune can create a progression !
      console.warn("Not authorized to create a progression!");
      return undefined;
    }
    console.log("Creating progression...");
    try {
      let response = await fetch(API_URL + "progression", {
        method: "POST",
        headers: Object.assign(authHeader(), {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      });
      let jsonResponse = await response.json();
      return jsonResponse.progression; // progression updated
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**Returns a boolean depending on the success of the update
   * role jeune: entry, progression
   * role relecteur: user/progression
   */
  static async updateProgression(data, route = "entry") {
    if (
      !store.state.auth.user ||
      (store.state.auth.user.role == "jeune" &&
        ["REVIEWING", "VALIDATED"].includes(data.state)) ||
      (store.state.auth.user.role != "jeune" &&
        !["REVIEWING", "VALIDATED", "REFUSED"].includes(data.state))
    ) {
      // Only a jeune can create a progression !
      console.warn("Not authorized to update a progression!");
      return undefined;
    }

    console.log("Updating progression...");
    try {
      let response = await fetch(API_URL + route, {
        method: "PUT",
        headers: Object.assign(authHeader(), {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error(response);
        return false; // Bad response (but can contain a payload)
      }
      let dataResponse = {};
      try {
        dataResponse = await response.json();
      } catch (error) {
        console.error(error);
        return false;
      }
      if (dataResponse.message) {
        return true;
      }
      console.warn("No message item in response payload!");
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async getProgressions() {
    // Returns undefined or a JS object
    console.log("Fetching progressions...");
    try {
      let response = await fetch(API_URL + "progressions", {
        method: "GET",
        headers: authHeader(),
      });
      let data = await response.json();
      return data.progressions;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async getUserProgressions() {
    console.log("Fetching progressions...");
    try {
      let response = await fetch(API_URL + "user/progressions", {
        method: "GET",
        headers: authHeader(),
      });
      let data = await response.json();
      return data.progressions;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async getUserProgression(idProgression) {
    console.log("Fetching progression: " + idProgression);
    try {
      let response = await fetch(
        API_URL + "user/progression/" + idProgression,
        {
          method: "GET",
          headers: authHeader(),
        }
      );
      let data = await response.json();
      return data.progression;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // DEPRECATED
  static async getGroupeProgressions() {
    console.log("Fetching progressions...");
    try {
      let response = await fetch(API_URL + "groupe/progressions", {
        method: "GET",
        headers: authHeader(),
      });
      let data = await response.json();
      return data.Progressions;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // DEPRECATED
  static async getTerritoireProgressions() {
    console.log("Fetching progressions...");
    try {
      let response = await fetch(API_URL + "territoire/progressions", {
        method: "GET",
        headers: authHeader(),
      });
      let data = await response.json();
      return data.Progressions;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async getGroup() {
    console.log("Fetching group...");
    try {
      let response = await fetch(API_URL + "groupe", {
        method: "GET",
        headers: authHeader(),
      });
      let data = await response.json();
      return data.groupe;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async getTerritoire() {
    console.log("Fetching territoire...");
    try {
      let response = await fetch(API_URL + "territoire", {
        method: "GET",
        headers: authHeader(),
      });
      let data = await response.json();
      return data.territoire;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
