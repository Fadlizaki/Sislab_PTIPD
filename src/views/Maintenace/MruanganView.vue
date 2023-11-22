<template>
  <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card flat class="border mb-4">
      <div class="d-flex">
        <v-card-title class="me-auto">Data Maintenace Ruangan</v-card-title>
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
                <span class="headline">Tambah Data</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="form" @submit.prevent="onSubmit">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="formData.nama"
                          label="Nama"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="formData.id_ruangan"
                          label="Ruangan"
                          :items="getAvailableRuangan"
                          :item-props="ruanganProps"
                          :rules="[required]"
                          variant="outlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="formData.tanggal_mulai"
                          label="Tanggal Masuk"
                          type="date"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="formData.tanggal_berakhir"
                          label="Tanggal Berakhir"
                          type="date"
                          :rules="[required]"
                          variant="outlined"
                          :min="formData.tanggal_mulai"
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
              <v-icon v-bind="props" @click="openDialogEdit(mruangan)"></v-icon>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Edit Data Ruangan</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.nama"
                        label="Nama"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.id_ruangan"
                        label="Ruangan"
                        :items="getDataRuangan"
                        :item-props="ruanganProps"
                        :rules="[required]"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.tanggal_mulai"
                        label="Tanggal Masuk"
                        type="date"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.tanggal_berakhir"
                        label="Tanggal Berakhir"
                        type="date"
                        :rules="[required]"
                        variant="outlined"
                        :min="formData.tanggal_mulai"
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
            <th>Nama PIC</th>
            <th>Ruangan</th>
            <th>Tanggal Mulai</th>
            <th>Tanggal Selesai</th>
            <th v-if="adminRole === 'admin'">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mruangan, index) in filteredData" :key="mruangan.id">
            <td>{{ index + 1 }}</td>
            <td>{{ mruangan.id }}</td>
            <td>{{ mruangan.nama }}</td>
            <td>{{ mruangan.nama_ruangan }}</td>
            <td>{{ convertISOtoDate(mruangan.tanggal_mulai) }}</td>
            <td>{{ convertISOtoDate(mruangan.tanggal_berakhir, mruangan) }}</td>
            <td v-if="adminRole === 'admin'">
              <v-icon v-bind="props" @click="openDialogEdit(mruangan)"
                >mdi-pencil</v-icon
              >
              <v-icon @click="hapusBarang(mruangan.id)"  >mdi-delete</v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";
import "moment/locale/id";

export default {
  computed: {
    // GETTERS DATA Maintenace RUANGAN
    ...mapGetters("mruangan", ["getDataruanganmain", "getruanganmainTerpilih"]),
    // GETTERS DATA RUANGAN
    ...mapGetters("ruangan", ["getDataRuangan"]),
    getAvailableRuangan() {
      // Filter ruangan yang belum dipilih
      return this.getDataRuangan.filter(
        (ruangan) =>
          !this.getDataruanganmain.some(
            (selectedRuangan) => selectedRuangan.id_ruangan === ruangan.id
          )
      );
    },
    filteredData() {
      const searchLowerCase = this.search.toLowerCase();
      return this.getDataruanganmain.filter((mruangan) => {
        return (
          (typeof mruangan.id_komputer === "string" &&
            mruangan.id_komputer.toLowerCase().includes(searchLowerCase)) ||
          (mruangan.nama &&
            mruangan.nama.toLowerCase().includes(searchLowerCase)) ||
          (mruangan.nama_ruangan &&
            mruangan.nama_ruangan.toLowerCase().includes(searchLowerCase)) ||
          (mruangan.tanggal_mulai &&
            this.formatDate(mruangan.tanggal_mulai).includes(
              searchLowerCase
            )) ||
          (mruangan.tanggal_berakhir &&
            this.formatDate(mruangan.tanggal_berakhir).includes(
              searchLowerCase
            ))
        );
      });
    },
    isAdmin() {
      return this.$store.getters["auth/adminRole"] === "admin";
    },
  },
  methods: {
    ...mapActions("mruangan", [
      "fetchDataruanganmain",
      "tambahDataruanganmain",
      "ubahDataruanganmain",
      "hapusDataruanganmain",
    ]),
    ...mapMutations("mruangan", ["ruanganmainTerpilih"]),
   
    watch: {
      "formData.tanggal_mulai": function () {
        this.formData.tanggal_berakhir = "";
      },
    },
    convertISOtoDate(isoString, mruangan) {
      try {
        let tanggalAwal = new Date(isoString);
        tanggalAwal.setDate(tanggalAwal.getDate() + 1);
        const parsedDate = moment.utc(tanggalAwal); // Menggunakan moment.utc()
        parsedDate.locale("id");

        if (parsedDate.isValid()) {
          const formattedDate = parsedDate.locale("id").format("DD MMM YYYY");

          // Tambahkan logika untuk menangani tanggal berakhir yang sudah lewat
          if (mruangan && parsedDate.isBefore(moment.utc(), "day")) {
            // Hapus data jika tanggal berakhir sudah lewat
            this.hapusDataruanganmain(mruangan.id);
            return "Data Expired";
          }

          return formattedDate;
        } else {
          console.error("Invalid Date:", isoString);
          return "Invalid Date";
        }
      } catch (error) {
        console.error("Error converting ISO to date:", error);
        return "Invalid Date";
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en-US", options).toLowerCase();
    },
    ruanganProps(ruangan) {
      return {
        title: ruangan.nama_ruangan,
        value: ruangan.id,
      };
    },

    onSubmit() {
      if (!this.form) return;
    },
    required(v) {
      return !!v || "wajib diisi";
    },

    async tambahBarang() {
      try {
        if (this.$refs.form.validate()) {
          await this.tambahDataruanganmain(this.formData).then(async () => {
            await this.fetchDataruanganmain(); // Ambil data terbaru
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
        const ruanganmainId = this.formData.id;
        let formEditruanganmain = { ...this.formData };
        let keysToDelete = ["created_at", "updated_at"];
        keysToDelete.forEach((key) => delete formEditruanganmain[key]);

        formEditruanganmain.tanggal_mulai = moment(
          formEditruanganmain.tanggal_mulai
        ).format("YYYY-MM-DD");
        formEditruanganmain.tanggal_berakhir = moment(
          formEditruanganmain.tanggal_berakhir
        ).format("YYYY-MM-DD");

        await this.ubahDataruanganmain({
          ruanganmainId,
          formEditruanganmain,
        }).then(async () => {
          await this.fetchDataruanganmain(); // Ambil data terbaru
          this.resetForm(); // Reset formulir
          this.dialogEdit = false;
        });
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    hapusBarang(idruanganmain) {
      this.komputerToDelete = idruanganmain;
      this.dialogDeleteConfirmation = true;
    },
    hapusData() {
      try {
        const idruanganmain = this.komputerToDelete;
        // Panggil aksi hapusDataKomputer dengan idruanganmain yang ingin dihapus
        this.hapusDataruanganmain(idruanganmain).then(async () => {
          await this.fetchDataruanganmain(); // Ambil data terbaru
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
        nama: "",
        id_ruangan: "",
        tanggal_mulai: "",
        tanggal_berakhir: "",
      };
    },

    closeDialog() {
      this.resetForm(); // Memanggil metode resetForm saat dialog ditutup
      this.dialogCreate = false;
    },
    openDialogEdit(mruangan) {
      this.formData = {
        ...mruangan,
        tanggal_mulai: moment(mruangan.tanggal_mulai).format("YYYY-MM-DD"),
        tanggal_berakhir: moment(mruangan.tanggal_berakhir).format(
          "YYYY-MM-DD"
        ),
      };
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
        nama: "",
        id_ruangan: "",
        tanggal_mulai: "",
        tanggal_berakhir: "",
      },

      items: [
        {
          title: "Maintenace",
          disabled: true,
          href: "",
        },
        {
          title: "Data Maintenace Ruangan",
          disabled: false,
          href: "",
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("mruangan/fetchDataruanganmain");
    this.$store.dispatch("ruangan/fetchDataRuangan");
    this.adminRole = localStorage.getItem("role");
  },
};
</script>
