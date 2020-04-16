import axios from "axios";
import { API_URL } from "./config";

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
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      }
      throw("Erreur inconnue");
    } catch (error) {
      console.log("Error while retrieving token");
      console.error(error);
      throw(error);
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  // for test purposes only
  register(user) {
    return axios.post(API_URL + "register", {
      code_adherent: user.code_adherent,
      role: user.role,
    });
  }
}

export default new AuthService();
