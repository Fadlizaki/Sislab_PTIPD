import axios from "axios";
import router from "../../router"; // Sesuaikan jalur impor ini dengan struktur proyek Anda

const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
    loginError: {
      message: null,
      isDisplayed: false,
    },
    isAuthenticated: false,
    response: null,
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const loginUrl =
          "https://ptipd-lab-inventory-api-production.up.railway.app/users/login";
        const response = await axios.post(loginUrl, credentials);
        const token = response.data.data.token;
        const username = response.data.data.profile.name;
        const email = response.data.data.profile.email;
        const role = response.data.data.profile.role;
        const isVerified = response.data.data.profile.isVerified;

        // Check if the email is verified
        if (!isVerified) {
          const errorMessage =
            "Email not verified. Please check your email for verification instructions.";
          alert(errorMessage);

          // If email is not verified, return false to prevent further execution
          return false;
        }

        // Set user information after successful login
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);

        commit("SET_TOKEN", token);
        commit("SET_LOGIN_ERROR", null);
        commit("SET_AUTHENTICATED", true);

        console.log("Login Successful");
        router.push("/home");
        commit("CLEAR_LOGIN_ERROR"); // Clear error message
        return true;
      } catch (error) {
        // Handle other types of errors (not related to email verification)
        const errorMessage = error.response?.data?.message || "Login Failed";
        commit("SET_LOGIN_ERROR", { message: errorMessage, isDisplayed: true });
        console.error(errorMessage);
        return false;
      }
    },

    async register({ commit }, credentials) {
      try {
        const registerUrl =
          "https://ptipd-lab-inventory-api-production.up.railway.app/users/register";
        const responseRegister = await axios.post(registerUrl, credentials);
        const responseAlert = responseRegister.data.data.message;
        alert(responseAlert);

        // Informasikan bahwa pendaftaran berhasil dan beri instruksi kepada pengguna
        commit("SET_RESPONSE_REGISTER", responseAlert);

        // Beri instruksi untuk memeriksa kotak pesan email
        alert(
          "Pendaftaran berhasil! Silakan periksa kotak pesan email Anda untuk langkah selanjutnya."
        );

        // Anda juga bisa menavigasikan pengguna ke halaman lain yang berisi instruksi lebih lanjut
        // router.push("/verification-instructions");

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      commit("SET_TOKEN", "");
      commit("SET_AUTHENTICATED", false);
      console.log("Token Removed");
      router.push("/login"); // Arahkan pengguna ke halaman login setelah logout
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_AUTHENTICATED(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    SET_RESPONSE_REGISTER(state, res) {
      state.response = res;
    },
    SET_LOGIN_ERROR(state, error) {
      state.loginError = error;
    },
    CLEAR_LOGIN_ERROR(state) {
      state.loginError = { message: null, isDisplayed: false };
    },
  },
};

export default auth;
