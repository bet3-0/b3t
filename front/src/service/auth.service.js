import axios from "axios";
import {API_URL} from "./config";

class AuthService {
  login(user) {
    return axios
      .post(
        API_URL + "login",
        JSON.stringify({
          data: {
            code_adherent: user.code_adherent
          },
          headers: { "Content-Type": "application/json" }
        })
      )
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  // for test purposes only
  register(user) {
    return axios.post(API_URL + "register", {
      code_adherent: user.code_adherent,
      role: user.role
    });
  }
}

export default new AuthService();
