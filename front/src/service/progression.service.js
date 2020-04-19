/* This is an example file */
import authHeader from "./auth-header";
import { API_URL } from "./config";

export default class ProgressionService {
  /** Sends an empty progression to back to create a new progression
   */
  static async createProgression(data) {
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
   * role relecteru: user/progression
   */
  static async updateProgression(data, route = "entry") {
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
    console.log("Fetching progression...");
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
}
