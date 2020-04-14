/* This is an example file */
import axios from "axios";
import authHeader from "./auth-header";
import { API_URL } from "./config";

export default class ProgressionService {
  static async createProgression(data) {
    return await fetch(API_URL + "progression", {
      method: "POST",
      headers: Object.assign(authHeader(), {
        "Content-Type": "application/json"
      }),
      body: data
    });
  }

  static async updateProgression(data) {
    console.log("Updating progression...");
    return await fetch(API_URL + "progression", {
      method: "PUT",
      headers: Object.assign(authHeader(), {
        "Content-Type": "application/json"
      }),
      body: data
    });
  }

  static async pushFile(data) {
    console.log("Pushing file...");
    return await fetch(API_URL + "file", {
      method: "POST",
      headers: Object.assign(authHeader(), {
        "Content-Type": "application/octet-stream"
      }),
      body: data
    });
  }

  // DEPRECATED
  static getProgressionsAxios() {
    return axios.get(
      API_URL + "progressions",
      JSON.stringify({ headers: authHeader() })
    );
  }

  static async getProgressions() {
    console.log("Fetching progressions...");
    return await fetch(API_URL + "progressions", {
      method: "GET",
      headers: authHeader()
    });
  }
}
