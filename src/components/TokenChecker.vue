// eslint-disable-next-line vue/valid-template-root
<template>
  <p></p>
</template>

<script>
import router from "@/router";
export default {
  mounted() {
    this.checkAndDeleteToken();
  },
  methods: {
    checkAndDeleteToken() {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = this.parseJwt(token);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTimestamp) {
          this.showTokenExpiredNotification();
        }
      }
    },
    showTokenExpiredNotification() {
      alert("Token Sudah Kadaluarsa");
      localStorage.removeItem("token");
      router.push("/login");
    },
    parseJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64));
      return JSON.parse(jsonPayload);
    },
  },
};
</script>
