import axios from "axios";

const API_URL = "http://bet3-0.sgdf.fr/api/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login", JSON.stringify({
        data: {
          code_adherent: user.code_adherent,
        },
      }))
      .then((response) => {
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
      role: user.role,
    });
  }
}

export default new AuthService();
