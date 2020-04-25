import {API_URL} from "./config";
import store from '../store'

class AuthService {
  async login(user) {
    try {
      let response = await fetch(API_URL + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code_adherent: user.code_adherent,
        }),
      });
      let data = await response.json();
      if (data.token) {
        let tokenPayload = this.parseJwt(data.token);
        console.log("Token payload: " + tokenPayload);
        data.role = tokenPayload.role
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      }
      throw "Erreur inconnue";
    } catch (error) {
      console.log("Error while retrieving token");
      console.error(error);
      throw error;
    }
  }

  logout() {
    // Remove all local storage
    localStorage.removeItem("user");
    localStorage.removeItem("activity");
    localStorage.removeItem("activities");
    localStorage.removeItem("parcours");
    localStorage.removeItem("progression");
    store.state.parcours.parcours = undefined;
    store.state.progression.progression = 0;

  }

  parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  /*
  Token expected payload
  {
  "code_adherent": "1",
  "code_structure_groupe": "1",
  "code_structure_territoire": "1",
  "iat": 1587005638,
  "role": "jeune"
  }
  */
}

export default new AuthService();
