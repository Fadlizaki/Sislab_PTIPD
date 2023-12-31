<template>
  <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card flat class="border mb-4">
      <div class="d-flex">
        <v-card-title class="me-auto">Data Merk</v-card-title>
        <v-text-field
          v-model="search"
          :loading="loading"
          density="compact"
          variant="outlined"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          @click:append-inner="onClick"
          class="py-1"
          style="max-width: 200px"
        ></v-text-field>
        <v-card-title>
          <v-dialog v-model="dialogCreate" persistent width="1024">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props"> Tambah </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Tambah Merk</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="form" @submit.prevent="onSubmit">
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="formData.nama_merk"
                          label="Nama Merk"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="closeDialog"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="tambahBarang"
                  :disabled="!form"
                  type="submit"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogEdit" persistent width="1024">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" @click="openDialogEdit(merk)"></v-icon>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Edit Data Merk</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="formData.nama_merk"
                        label="Nama Merk"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="closeDialogEdit"
                >
                  Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="editData">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDeleteConfirmation" max-width="500">
            <v-card>
              <v-card-title class="headline"
                >Konfirmasi Hapus Data</v-card-title
              >
              <v-card-text>
                Apakah Anda yakin ingin menghapus data ini?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialogDeleteConfirmation = false"
                  >Batal</v-btn
                >
                <v-btn color="red darken-1" text @click="hapusData"
                  >Hapus</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
      </div>
      <v-table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Nama Merk</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(merk, index) in filteredData" :key="merk.id">
            <td>{{ index + 1 }}</td>
            <td>{{ merk.id }}</td>
            <td>{{ merk.nama_merk }}</td>
            <td>
              <v-icon v-bind="props" @click="openDialogEdit(merk)"
                >mdi-pencil</v-icon
              >
              <v-icon @click="hapusBarang(merk.id)">mdi-delete</v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters("merk", ["getDataMerk", "getmerkterpilih"]),
    filteredData() {
  const searchLowerCase = this.search.toLowerCase();
  return this.getDataMerk.filter((merk) => {
    return (
      (typeof merk.id === 'string' && merk.id.toLowerCase().includes(searchLowerCase)) ||
      (merk.nama_merk && merk.nama_merk.toLowerCase().includes(searchLowerCase)) 
    );
  });
},
  },
  methods: {
    ...mapActions("merk", [
      "fetchDataMerk",
      "tambahDatamerk",
      "ubahDatamerk",
      "hapusDatamerk",
    ]),
    ...mapMutations("merk", ["merkTerpilih"]),

    onSubmit() {
      if (!this.form) return;
    },
    required(v) {
      return !!v || "wajib diisi";
    },

    async tambahBarang() {
      try {
        if (this.$refs.form.validate()) {
          await this.tambahDatamerk(this.formData).then(async () => {
            await this.fetchDataMerk(); // Ambil data terbaru
            this.resetForm(); // Reset formulir
            this.dialogCreate = false;
          });
        } else {
          alert("Silakan isi semua bidang sebelum menyimpan.");
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async editData() {
      try {
        const merkId = this.formData.id;
        let formEditmerk = { ...this.formData };
        let keysToDelete = ["created_at", "updated_at"];
        keysToDelete.forEach((key) => delete formEditmerk[key]);

        await this.ubahDatamerk({ merkId, formEditmerk }).then(async () => {
          await this.fetchDataMerk(); // Ambil data terbaru
          this.resetForm(); // Reset formulir
          this.dialogEdit = false;
        });
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    hapusBarang(idmerk) {
      this.komputerToDelete = idmerk;
      this.dialogDeleteConfirmation = true;
    },
    hapusData() {
      try {
        const idmerk = this.komputerToDelete;
        // Panggil aksi hapusDataKomputer dengan idmerk yang ingin dihapus
        this.hapusDatamerk(idmerk).then(async () => {
          await this.fetchDataMerk(); // Ambil data terbaru
          this.komputerToDelete = null; // Reset nilai komputerToDelete
          this.dialogDeleteConfirmation = false; // Tutup dialog konfirmasi
        });
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    resetForm() {
      this.formData = {
        id: null,
        nama_merk: "",
      };
    },

    closeDialog() {
      this.resetForm(); // Memanggil metode resetForm saat dialog ditutup
      this.dialogCreate = false;
    },
    openDialogEdit(merk) {
      this.formData = { ...merk };
      console.log(this.formData);
      // Buka dialog edit
      this.dialogEdit = true;
    },
    closeDialogEdit() {
      this.resetForm(); // Memanggil metode resetForm saat dialog ditutup
      this.dialogEdit = false;
    },
  },
  data: () => {
    return {
      search: "",
      form: false,
      dialog: false,
      dialogCreate: false,
      dialogEdit: false,
      dialogDeleteConfirmation: false,
      komputerToDelete: null,

      formData: {
        nama_merk: "",
      },

      items: [
        {
          title: "Setting",
          disabled: true,
          href: "",
        },
        {
          title: "Data Merk",
          disabled: false,
          href: "",
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("merk/fetchDataMerk");
  },
};
</script>
