/* This is an example file */
import authHeader from "./auth-header";
import { API_URL } from "./config";

export default class ProgressionService {
  static async createProgression(data) {
    console.log("Creating progression...");
    let response = await fetch(API_URL + "progression", {
      method: "POST",
      headers: Object.assign(authHeader(), {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    });
    console.log(response);
    let jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse.progression;
  }

  static async updateProgression(data, route = "entry") {
    console.log("Updating progression...");
    return await fetch(API_URL + route, {
      method: "PUT",
      headers: Object.assign(authHeader(), {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    });
  }

  static async getProgressions() {
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
      let response = await fetch(API_URL + "user/progression/"+idProgression, {
        method: "GET",
        headers: authHeader(),
      });
      let data = await response.json();
      return data.progression;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
