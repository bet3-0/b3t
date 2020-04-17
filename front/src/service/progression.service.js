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

  static async pushFile(data) {
    console.log("Pushing file...");
    let response;
    try {
      response = await fetch(API_URL + "file", {
        method: "POST",
        headers: Object.assign(authHeader(), {
          "Content-Type": "application/octet-stream",
        }),
        body: data,
      });
    } catch (error) {
      console.log("Error while sending file: fetch error!");
      console.error(error);
      return undefined;
    }
    if (!response.ok) {
      console.log("Error while sending file: response error!");
      console.warn(response);
      return undefined;
    }

    let jsonResponse;
    try {
      jsonResponse = await response.json();
    } catch (error) {
      console.log("Error while sending file: response data error!");
      console.warn(response);
      return undefined;
    }
    console.log("File sent successfully!");
    return jsonResponse.url;
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
}
