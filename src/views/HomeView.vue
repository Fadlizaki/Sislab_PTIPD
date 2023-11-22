<template>
  <v-container>
    <h1 class="mb-6">Dashboard</h1>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card
          class="rounded-lg"
          theme="dark"
          style="background: linear-gradient(to right, #5ab394, #a8e0cc)"
        >
          <div class="d-flex flex-no-wrap justify-center">
            <div class="py-8">
              <v-card-text class="text-h1 text-md-h5 text-lg-h2 ml-lg-10 ml-4">
                {{ totalComputers }}</v-card-text
              >
              <v-card-title class="text-h5 text-md-h5 text-lg-caption ml-7"
                >Total Komputer
              </v-card-title>
            </div>

            <v-avatar class="ma-3" size="100" rounded="0">
              <v-icon size="100">mdi-monitor</v-icon>
            </v-avatar>
          </div>
          <v-btn
            v-if="adminRole === 'admin'"
            block
            rounded="xl"
            size="x-small"
            color="#19A876"
            to="/datakomputer"
            ><span>Lihat</span></v-btn
          ><v-btn
            v-else
            block
            rounded="xl"
            size="x-small"
            color="#19A876"
          ></v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card
          class="rounded-lg"
          theme="dark"
          style="background: linear-gradient(to right, #e70b0b, #f38585)"
        >
          <div class="d-flex flex-no-wrap justify-center">
            <div class="py-8">
              <v-card-text
                class="text-h1 text-md-h5 text-lg-h2 ml-lg-10 ml-4"
                >{{ totalcomputerrusak }}</v-card-text
              >
              <v-card-title class="text-h5 text-md-h5 text-lg-caption ml-7">
                Komputer Rusak
              </v-card-title>
            </div>

            <v-avatar class="ma-3" size="100" rounded="0">
              <v-icon size="100">mdi-monitor-off</v-icon>
            </v-avatar>
          </div>
          <v-btn
            v-if="adminRole === 'admin'"
            block
            rounded="xl"
            size="x-small"
            color="#C8102E"
            to="/mbarang"
            ><span>Lihat</span></v-btn
          ><v-btn
            v-else
            block
            rounded="xl"
            size="x-small"
            color="#C8102E"
          ></v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card
          class="rounded-lg"
          theme="dark"
          style="background: linear-gradient(to right, #77c7fb, #bbe3fd)"
        >
          <div class="d-flex flex-no-wrap justify-center">
            <div class="py-8">
              <v-card-text
                class="text-h1 text-md-h5 text-lg-h2 ml-lg-10 ml-4"
                >{{ totalbarangpinjam }}</v-card-text
              >
              <v-card-title class="text-h5 text-md-h5 text-lg-caption ml-7"
                >Barang Dipinjam
              </v-card-title>
            </div>

            <v-avatar class="ma-3" size="100" rounded="0">
              <v-icon size="100">mdi-devices</v-icon>
            </v-avatar>
          </div>
          <v-btn
            v-if="adminRole === 'admin'"
            block
            rounded="xl"
            size="x-small"
            color="#5093BE"
            to="/jlbarang"
            ><span>Lihat</span></v-btn
          >
          <v-btn
            v-else
            block
            rounded="xl"
            size="x-small"
            color="#5093BE"
          ></v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card
          class="rounded-lg"
          theme="dark"
          style="background: linear-gradient(to right, #7b57e0, #bdabf0)"
        >
          <div class="d-flex flex-no-wrap justify-center">
            <div class="py-8">
              <v-card-text
                class="text-h1 text-md-h5 text-lg-h2 ml-lg-10 ml-4"
                >{{ totalruangan }}</v-card-text
              >
              <v-card-title class="text-h5 text-md-h5 text-lg-caption ml-8"
                >Ruangan Dipinjam
              </v-card-title>
            </div>

            <v-avatar class="ma-3" size="100" rounded="0">
              <v-icon size="100">mdi-door</v-icon>
            </v-avatar>
          </div>
          <v-btn
            v-if="adminRole === 'admin'"
            block
            rounded="xl"
            size="x-small"
            color="#7D58E4"
            to="/jlruangan"
            ><span>Lihat</span></v-btn
          >
          <v-btn
            v-else
            block
            rounded="xl"
            size="x-small"
            color="#7D58E4"
          ></v-btn>
        </v-card>
        <v-card class="mx-auto" max-width="368"> </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    
  },
  computed: {
    totalComputers() {
      return this.$store.getters["komputer/totalComputers"];
    },
    totalcomputerrusak() {
      return this.$store.getters["mbarang/totalbarangmain"];
    },
    totalruangan() {
      return this.$store.getters["ruangans/totalruangan"];
    },
    totalbarangpinjam() {
      return this.$store.getters["barang/totalpinjambarang"];
    },
    isAdmin() {
      return this.$store.getters["auth/adminRole"] === "admin";
    },
  },
  created() {
    this.$store.dispatch("komputer/fetchDataKomputer");
    this.$store.dispatch("mbarang/fetchDatabarangmain");
    this.$store.dispatch("ruangans/fetchDataruangan");
    this.$store.dispatch("barang/fetchDatabarang");
    this.adminRole = localStorage.getItem("role");
  },
};
</script>

<style scoped></style>
