/* This is an example file */
import axios from "axios";
import authHeader from "./auth-header";
import {API_URL} from "./config";


class ProgressionService {
  createProgression(data) {
    return axios.post(
      API_URL + "progression",
      JSON.stringify({
        headers: Object.assign(authHeader(), {
          "Content-Type": "application/json"
        }),
        data: data
      })
    );
  }

  updateProgression(data) {
    return axios.put(
      API_URL + "progression",
      JSON.stringify({
        headers: Object.assign(authHeader(), {
          "Content-Type": "application/json"
        }),
        data: data
      })
    );
  }
  

  pushFile() {
    return axios.get(
      API_URL + "file",
      JSON.stringify({
        headers: Object.assign(authHeader(), {
          "Content-Type": "application/octet-stream"
        })
      })
    );
  }

  getProgressions() {
    return axios.get(
      API_URL + "progressions",
      JSON.stringify({ headers: authHeader() })
    );
  }

  getProgressionsFetch() { // DEPRECATED
    return fetch(
      API_URL + "progressions",
      JSON.stringify({ method: "GET", headers: authHeader() })
    );
  }
}

export default new ProgressionService();
