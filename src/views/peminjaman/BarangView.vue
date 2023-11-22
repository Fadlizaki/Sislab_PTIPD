<template>
  <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card flat class="border mb-4">
      <div class="d-flex">
        <v-card-title class="me-auto">Data Barang</v-card-title>

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
                          v-model="formData.peminjam"
                          label="Nama"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="formData.instansi"
                          label="Intansi"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="formData.id_komputer"
                          label="Barang"
                          :items="getAvailablekomputer"
                          :item-props="komputerProps"
                          :rules="[required]"
                          variant="outlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="formData.tgl_peminjaman"
                          label="Tanggal Peminjaman"
                          type="date"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="formData.tgl_kembali"
                          label="Tanggal Berakhir"
                          type="date"
                          :rules="[required]"
                          variant="outlined"
                          :min="formData.tgl_peminjaman"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-file-input
                          v-model="formData.file"
                          :name="formData.file ? formData.file.name : ''"
                          label="Document"
                          variant="outlined"
                          :items="getFilesForMap(formData.file)"
                          multiple="false"
                        ></v-file-input>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="formData.status_peminjaman"
                          label="Keterangan"
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
              <v-icon v-bind="props" @click="openDialogEdit(barang)"></v-icon>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Edit Data Barang</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.peminjam"
                        label="Nama"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.instansi"
                        label="Intansi"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="formData.id_komputer"
                        label="Barang"
                        :items="getDataKomputer"
                        :item-props="komputerProps"
                        :rules="[required]"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formData.tgl_peminjaman"
                        label="Tanggal Peminjaman"
                        type="date"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formData.tgl_kembali"
                        label="Tanggal Berakhir"
                        type="date"
                        :rules="[required]"
                        variant="outlined"
                        :min="formData.tgl_peminjaman"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="formData.status_peminjaman"
                        label="Keterangan"
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
            <th>Nama Peminjam</th>
            <th>Intansi/Unit</th>
            <th>Jenis Barang</th>
            <th>Ruangan</th>
            <th>Tanggal Mulai</th>
            <th>Tanggal Selesai</th>
            <th>Document</th>
            <th>Keterangan</th>
            <th v-if="adminRole === 'admin'">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(barang, index) in filteredData" :key="barang.id">
            <td>{{ index + 1 }}</td>
            <td>{{ barang.id }}</td>
            <td>{{ barang.peminjam }}</td>
            <td>{{ barang.instansi }}</td>
            <td>{{ barang.jenis }}</td>
            <td>{{ barang.nama_ruangan }}</td>
            <td>{{ convertISOtoDate(barang.tgl_peminjaman) }}</td>
            <td>{{ convertISOtoDate(barang.tgl_kembali) }}</td>
            <td>
              <a v-if="barang.file" :href="barang.file" target="_blank">{{
                barang.file
              }}</a>
              <span v-else>Tidak ada file</span>
            </td>
            <td>{{ barang.status_peminjaman }}</td>
            <td v-if="adminRole === 'admin'">
              <v-icon v-bind="props" @click="openDialogEdit(barang)"
                >mdi-pencil</v-icon
              >
              <v-icon @click="hapusBarang(barang.id)">mdi-delete</v-icon>
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
    // GETTERS DATA PEMINJAMAN RUANGAN
    ...mapGetters("barang", ["getDatabarang", "getbarangTerpilih"]),
    // GETTERS DATA RUANGAN
    ...mapGetters("ppkomputer", ["getDataKomputer"]),
    getAvailablekomputer() {
      // Filter ruangan yang belum dipilih
      return this.getDataKomputer.filter(
        (ppkomputer) =>
          !this.getDatabarang.some(
            (selectedKomputer) => selectedKomputer.id_komputer === ppkomputer.id
          )
      );
    },
    filteredData() {
      const searchLowerCase = this.search.toLowerCase();
      return this.getDatabarang.filter((barang) => {
        return (
          (typeof barang.id === "string" &&
            barang.id.toLowerCase().includes(searchLowerCase)) ||
          (barang.instansi &&
            barang.instansi.toLowerCase().includes(searchLowerCase)) ||
          (barang.peminjam &&
            barang.peminjam.toLowerCase().includes(searchLowerCase)) ||
          (barang.jenis &&
            barang.jenis.toLowerCase().includes(searchLowerCase)) ||
          (barang.nama_ruangan &&
            barang.nama_ruangan.toLowerCase().includes(searchLowerCase)) ||
          (barang.status_peminjaman &&
            barang.status_peminjaman.toLowerCase().includes(searchLowerCase)) ||
          (barang.tgl_peminjaman &&
            this.formatDate(barang.tgl_peminjaman).includes(searchLowerCase)) ||
          (barang.tgl_kembali &&
            this.formatDate(barang.tgl_kembali).includes(searchLowerCase))
        );
      });
    },
    isAdmin() {
      return this.$store.getters["auth/adminRole"] === "admin";
    },
  },
  methods: {
    ...mapActions("barang", [
      "fetchDatabarang",
      "tambahDatabarang",
      "ubahDatabarang",
      "hapusDatabarang",
    ]),
    ...mapMutations("barang", ["pinjambarangTerpilih"]),

    watch: {
      "formData.tgl_peminjaman": function () {
        this.formData.tgl_kembali = "";
      },
    },
    convertISOtoDate(isoString, barang) {
      try {
        let tanggalAwal = new Date(isoString);
        tanggalAwal.setDate(tanggalAwal.getDate() + 1);
        const parsedDate = moment.utc(tanggalAwal); // Menggunakan moment.utc()
        parsedDate.locale("id");

        if (parsedDate.isValid()) {
          const formattedDate = parsedDate.locale("id").format("DD MMM YYYY");

          // Tambahkan logika untuk menangani tanggal berakhir yang sudah lewat
          if (barang && parsedDate.isBefore(moment.utc(), "day")) {
            // Hapus data jika tanggal berakhir sudah lewat
            this.hapusDatabarang(barang.id);
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
    getFilesForMap(files) {
      if (Array.isArray(files)) {
        return files;
      } else if (files) {
        return [files];
      } else {
        return [];
      }
    },

    komputerProps(komputer) {
      return {
        value: komputer.id,
        title: komputer.id + komputer.jenis,

      };
    },

    onSubmit() {
      if (!this.form) return;
    },
    required(v) {
      return !!v || "wajib diisi";
    },

    prepareFormData() {
      const formData = new FormData();
      if (this.formData.file) {
        const uploadedFile = this.formData.file[0];
        if (uploadedFile instanceof File) {
          formData.append("file", uploadedFile, uploadedFile.name);
        }
      }
      Object.keys(this.formData).forEach((key) => {
        if (key !== "file") {
          formData.append(key, this.formData[key]);
        }
      });
      return formData;
    },
    async tambahBarang() {
      if (this.$refs.form.validate()) {
        const formData = this.prepareFormData();
        await this.tambahDatabarang(formData);
        await this.fetchDatabarang();
        this.resetForm();
        this.dialogCreate = false;
      } else {
        alert("Silakan isi semua bidang sebelum menyimpan.");
      }
    },
    async editData() {
      try {
        const barangId = this.formData.id;
        let formEditbarang = { ...this.formData };
        let keysToDelete = ["created_at", "updated_at"];
        keysToDelete.forEach((key) => delete formEditbarang[key]);

        formEditbarang.tgl_peminjaman = moment(
          formEditbarang.tgl_peminjaman
        ).format("YYYY-MM-DD");
        formEditbarang.tgl_kembali = moment(formEditbarang.tgl_kembali).format(
          "YYYY-MM-DD"
        );

        await this.ubahDatabarang({ barangId, formEditbarang }).then(
          async () => {
            await this.fetchDatabarang(); // Ambil data terbaru
            this.resetForm(); // Reset formulir
            this.dialogEdit = false;
          }
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    hapusBarang(idbarang) {
      this.komputerToDelete = idbarang;
      this.dialogDeleteConfirmation = true;
    },
    hapusData() {
      try {
        const idbarang = this.komputerToDelete;
        // Panggil aksi hapusDataKomputer dengan idbarang yang ingin dihapus
        this.hapusDatabarang(idbarang).then(async () => {
          await this.fetchDatabarang(); // Ambil data terbaru
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
        peminjam: "",
        instansi: "",
        id_komputer: "",
        tgl_peminjaman: "",
        tgl_kembali: "",
        status_peminjaman: "",
        file: null,
      };
    },

    closeDialog() {
      this.resetForm(); // Memanggil metode resetForm saat dialog ditutup
      this.dialogCreate = false;
    },
    openDialogEdit(barang) {
      this.formData = {
        ...barang,
        tgl_peminjaman: moment(barang.tgl_peminjaman).format("YYYY-MM-DD"),
        tgl_kembali: moment(barang.tgl_kembali).format("YYYY-MM-DD"),
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
      file: null,

      formData: {
        peminjam: "",
        instansi: "",
        id_komputer: "",
        tgl_peminjaman: "",
        tgl_kembali: "",
        status_peminjaman: "",
      },
      items: [
        {
          title: "Jadwal Peminjaman ",
          disabled: true,
          href: "",
        },
        {
          title: "Data Barang",
          disabled: false,
          href: "",
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("barang/fetchDatabarang");
    this.$store.dispatch("ppkomputer/fetchDataKomputer");
    this.adminRole = localStorage.getItem("role");
  },
};
</script>
