<template>
  <v-navigation-drawer v-model="isDraweropen" width="300">
    <center>
      <v-img
        class="mt-2"
        width="90"
        height="32"
        src="../assets/PTIPD.png"
      ></v-img>
    </center>

    <v-list flat class="mt-4" active-class="border-list">
      <v-list-item prepend-icon="mdi-view-grid-outline" to="/home"
        >Dashboard</v-list-item
      >

      <v-list-group v-if="adminRole === 'admin' && showUserMenu" value="Master Data">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-package"
            >Master Data</v-list-item
          >
        </template>
        <v-list-item prepend-icon="mdi-monitor " to="/datakomputer"
          >Komputer</v-list-item
        >

        <v-list-item prepend-icon="mdi-laptop" to="/dataLaptop"
          >laptop</v-list-item
        >
        <v-list-item prepend-icon="mdi-set-all" to="/datalain"
          >Perangkat lainnya</v-list-item
        >
        <v-list-item prepend-icon="mdi-door" to="/ruangan"
          >Ruangan
        </v-list-item>
      </v-list-group>
      <v-list-group  value="PEMINJAMNAN">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-calendar-clock">
            Peminjaman
          </v-list-item>
        </template>
        <v-list-item  prepend-icon="mdi-door" to="/jlruangan">
          Ruangan
        </v-list-item>
        <v-list-item  prepend-icon="mdi-devices" to="/jlbarang">
          Barang
        </v-list-item>
      </v-list-group>
      
      <v-list-group  value="MAINTENANCE">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-tools">
            Maintenance
          </v-list-item>
        </template>
        <v-list-item  prepend-icon="mdi-door" to="/mruangan">
          Ruangan
        </v-list-item>
        <v-list-item  prepend-icon="mdi-devices" to="/mbarang">
          Barang
        </v-list-item>
      </v-list-group>
      <v-list-group v-if="adminRole === 'admin' && showUserMenu" value="Data Laporan">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-clipboard-text-search-outline"
            >Data Laporan</v-list-item
          >
        </template>

        <v-list-item prepend-icon="mdi-monitor" to="/Lkomputer"
          >komputer
        </v-list-item>
        <v-list-group value="LPEMINJAMNAN">
          <template #activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-calendar-clock"
              >Peminjaman</v-list-item
            >
          </template>

          <v-list-item prepend-icon="mdi-door" to="/Lruangan"
            >Ruangan
          </v-list-item>
          <v-list-item prepend-icon="mdi-devices" to="/Lbarang"
            >Barang
          </v-list-item>
        </v-list-group>
        <v-list-group value="LMAINTENANCE">
          <template #activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-tools"
              >Maintenace</v-list-item
            >
          </template>

          <v-list-item prepend-icon="mdi-door" to="/LMruangan"
            >Ruangan
          </v-list-item>
          <v-list-item prepend-icon="mdi-devices" to="/LMbarang"
            >Barang
          </v-list-item>
        </v-list-group>
      </v-list-group>
      <v-list-group v-if="adminRole === 'admin' && showUserMenu" value="Akun">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account"
            >Akun</v-list-item
          >
        </template>

        <v-list-item prepend-icon="mdi-account-details" to="/user"
          >User
        </v-list-item>
      </v-list-group>
      <v-list-group v-if="adminRole === 'admin' && showUserMenu" value="setting">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-cog-outline"
            >Setting</v-list-item
          >
        </template>

        <v-list-item to="/merk">Merk </v-list-item>
        <v-list-item to="/tipe">Kategory </v-list-item>
      </v-list-group>
      <v-list-item prepend-icon="mdi-logout" @click="logout"
        >Logout</v-list-item
      >
    </v-list>
  </v-navigation-drawer>

  <v-app-bar flat class="border-b">
    <v-app-bar-nav-icon
      @click="isDraweropen = !isDraweropen"
    ></v-app-bar-nav-icon>
    
    <template #append>
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="info">
              <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="info">
                <v-icon icon="mdi-account-circle"></v-icon>
              </v-avatar>
              <h3>{{ user.username }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style>
.border-list::before {
  transition: 0.5s ease;
  content: "";
  position: absolute;
  left: -1.2rem;
  height: 100%;
  border-left: 25px solid;
  color: #1b219a;
  border-radius: 0px 15px 15px 0px;
  opacity: 0;
  visibility: hidden;
}

.border-list:hover {
  color: #1b219a;
  transition: 0.5s ease;
}

.border-list:hover::before {
  opacity: 1;
  visibility: unset;
}
.custom-text-field {
  width: 100px; /* Sesuaikan dengan lebar yang diinginkan */
}
</style>

<script>
import { ref } from "vue";
import { mapActions } from "vuex";

export default {
  data: () => ({
    user: {
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
    
    },
  }),
  methods: {
    ...mapActions("auth", ["logout"]),
  },
  setup() {
    const isDraweropen = ref(false);

    // Anda dapat menggunakan isDraweropen dalam logika komponen jika diperlukan.

    return {
      adminRole: localStorage.getItem("role"), // Ambil peran pengguna dari localStorage atau tempat penyimpanan lainnya
      showUserMenu: true, // Sesuaikan dengan logika bisnis Anda

      isDraweropen,
    };
  },


  // ... methods dan setup lainnya ...
};
</script>
