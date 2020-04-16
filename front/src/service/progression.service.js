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

  static async updateProgression(data) {
    console.log("Updating progression...");
    return await fetch(API_URL + "progression", {
      method: "PUT",
      headers: Object.assign(authHeader(), {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    });
  }

  static async pushFile(data) {
    console.log("Pushing file...");
    try {
      let response = await fetch(API_URL + "file", {
        method: "POST",
        headers: Object.assign(authHeader(), {
          "Content-Type": "multipart/form-data",
        }),
        body: data,
      });
      console.log(response);
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      return jsonResponse.url;
    } catch (error) {
      console.log("Error while sending file!");
      console.error(error);
      return undefined;
    }
  }

  static async getProgressions() {
    console.log("Fetching progressions...");
    return await fetch(API_URL + "progressions", {
      method: "GET",
      headers: authHeader(),
    });
  }
}
