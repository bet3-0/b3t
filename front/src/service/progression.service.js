/* This is an example file */
import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://b3t-dev-guillaume.cleverapps.io/api/";

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

  getProgressionsAxios() {
    return axios.get(
      API_URL + "progressions",
      JSON.stringify({ headers: authHeader() })
    );
  }

  getProgressions() {
    return fetch(
      API_URL + "progressions",
      JSON.stringify({ method: "GET", headers: authHeader() })
    );
  }
}

export default new ProgressionService();
