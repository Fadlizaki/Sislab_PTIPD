<template>
  <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card flat class="border mb-4">
      <div class="d-flex">
        <v-card-title class="me-auto">Data Komputer</v-card-title>

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
        style="max-width: 200px;"
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
                          v-model="formData.urutan_meja"
                          label="Urutan Meja"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="2">
                        <v-select
                          v-model="formData.id_merk"
                          label="Merk"
                          :items="getDataMerk"
                          :item-props="merkProps"
                          :rules="[required]"
                          variant="outlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="2">
                        <v-select
                          v-model="formData.id_tipe"
                          label="Kategory"
                          :items="getDataTipe"
                          :item-props="tipeProps"
                          :rules="[required]"
                          variant="outlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="8">
                        <v-text-field
                          v-model="formData.spek"
                          label="Spek"
                          :rules="[required]"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          v-model="formData.kondisi"
                          label="Kondisi"
                          :rules="[required]"
                          :items="['Bagus', 'Sedang', 'Rusak']"
                          variant="outlined"
                        ></v-select>
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
              <v-icon v-bind="props" @click="openDialogEdit(komputer)"></v-icon>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Edit Data</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
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
                        v-model="formData.urutan_meja"
                        label="Urutan Meja"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-select
                        v-model="formData.id_merk"
                        label="Merk"
                        :items="getDataMerk"
                        :item-props="merkProps"
                        :rules="[required]"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-select
                        v-model="formData.id_tipe"
                        label="Kategory"
                        :items="getDataTipe"
                        :item-props="tipeProps"
                        :rules="[required]"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="formData.spek"
                        label="Spek"
                        :rules="[required]"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="formData.kondisi"
                        label="Kondisi"
                        :rules="[required]"
                        :items="['Bagus', 'Sedang', 'Rusak']"
                        variant="outlined"
                      ></v-select>
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
            <th>ID Komputer</th>
            <th>Merk</th>
            <th>Spek Komputer</th>
            <th>Ruangan</th>
            <th>Urutan Meja</th>
            <th>Kondisi</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(komputer, index) in filteredData" :key="komputer.id">
            <td>{{ index + 1 }}</td>
            <td>{{ komputer.id }}</td>
            <td>{{ komputer.nama_merk }}</td>
            <td>{{ komputer.spek }}</td>
            <td>{{ komputer.nama_ruangan }}</td>
            <td>{{ komputer.urutan_meja }}</td>
            <td>
              <v-chip :color="getKondisiChipColor(komputer.kondisi)" dark>
                {{ komputer.kondisi }}
              </v-chip>
            </td>
            <td>
              <v-icon v-bind="props" @click="openDialogEdit(komputer)"
                >mdi-pencil</v-icon
              >
              <v-icon @click="hapusBarang(komputer.id)">mdi-delete</v-icon>
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
    ...mapGetters("komputer", ["getDataKomputer", "getKomputerTerpilih"]),
    ...mapGetters("ruangan", ["getDataRuangan"]),
    ...mapGetters("merk", ["getDataMerk"]),
    ...mapGetters("tipe", ["getDataTipe"]),
    getDataTipe() {
      return this.$store.getters["tipe/getDataTipe"].filter(
        (tipe) => tipe.tipe_barang === "Komputer"
      );
    },
    filteredData() {
  const searchLowerCase = this.search.toLowerCase();
  return this.getDataKomputer.filter((komputer) => {
    return (
      (typeof komputer.id === 'string' && komputer.id.toLowerCase().includes(searchLowerCase)) ||
      (komputer.nama_merk && komputer.nama_merk.toLowerCase().includes(searchLowerCase)) ||
      (komputer.spek && komputer.spek.toLowerCase().includes(searchLowerCase)) ||
      (komputer.nama_ruangan && komputer.nama_ruangan.toLowerCase().includes(searchLowerCase)) ||
      (komputer.urutan_meja && komputer.urutan_meja.toLowerCase().includes(searchLowerCase)) ||
      (komputer.kondisi && komputer.kondisi.toLowerCase().includes(searchLowerCase))
    );
  });
},
  },
  methods: {
    ...mapActions("komputer", [
      "fetchDataKomputer",
      "tambahDataKomputer",
      "ubahDataKomputer",
      "hapusDataKomputer",
    ]),
    ...mapActions("ruangan", ["fetchDataRuangan"]),
    ...mapActions("merk", ["fetchDataMerk"]),
    ...mapActions("tipe", ["fetchDataTipe"]),
    ...mapMutations("komputer", ["pilihKomputer"]),

    onSubmit () {
        if (!this.form) return
    },
    required(v) {
      return !!v || "wajib diisi";
    },
    
    merkProps(merk) {
      return {
        title: merk.nama_merk,
        value: merk.id,
      };
    },
    tipeProps(tipe) {
      return {
        title: tipe.tipe_barang,
        value: tipe.id,
      };
    },
    ruanganProps(ruangan) {
      return {
        title: ruangan.nama_ruangan,
        value: ruangan.id,
      };
    },
    getKondisiChipColor(kondisi) {
      if (kondisi === "Rusak") {
        return "red";
      } else if (kondisi === "Sedang") {
        return "brown";
      } else if (kondisi === "Bagus") {
        return "green";
      } else {
        return "grey";
      }
    },

    async tambahBarang() {
      try {
        if (this.$refs.form.validate()) {
          await this.tambahDataKomputer(this.formData).then(async () => {
            await this.fetchDataKomputer(); // Ambil data terbaru
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
        const komputerId = this.formData.id;
        let formEditKomputer = { ...this.formData };
        let keysToDelete = ["nama_merk", "nama_ruangan", "tipe_barang", "id"];
        keysToDelete.forEach((key) => delete formEditKomputer[key]);

        await this.ubahDataKomputer({ komputerId, formEditKomputer }).then(
          async () => {
            await this.fetchDataKomputer(); // Ambil data terbaru
            this.resetForm(); // Reset formulir
            this.dialogEdit = false;
          }
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    hapusData() {
      try {
        const idKomputer = this.komputerToDelete;
        // Panggil aksi hapusDataKomputer dengan idKomputer yang ingin dihapus
        this.hapusDataKomputer(idKomputer).then(async () => {
          await this.fetchDataKomputer(); // Ambil data terbaru
          this.komputerToDelete = null; // Reset nilai komputerToDelete
          this.dialogDeleteConfirmation = false; // Tutup dialog konfirmasi
        });
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    hapusBarang(idKomputer) {
      this.komputerToDelete = idKomputer;
      this.dialogDeleteConfirmation = true;
    },
    openDialogEdit(komputer) {
      this.formData = { ...komputer };
      console.log(this.formData);
      // Buka dialog edit
      this.dialogEdit = true;
    },
    closeDialogEdit() {
      this.resetForm(); // Memanggil metode resetForm saat dialog ditutup
      this.dialogEdit = false;
    },
    closeDialog() {
      this.resetForm(); // Memanggil metode resetForm saat dialog ditutup
      this.dialogCreate = false;
    },
    resetForm() {
      this.formData = {
        id_merk: "",
        id_tipe: "",
        spek: "",
        kondisi: "",
        id_ruangan: "",
        urutan_meja: "",
      };
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
        id_merk: "",
        id_tipe: "",
        spek: "",
        kondisi: "",
        id_ruangan: "",
        urutan_meja: "",
      },
      items: [
        {
          title: "Master Data",
          disabled: true,
          href: "",
        },
        {
          title: "Data Komputer",
          disabled: false,
          href: "",
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("komputer/fetchDataKomputer");
    this.$store.dispatch("ruangan/fetchDataRuangan");
    this.$store.dispatch("merk/fetchDataMerk");
    this.$store.dispatch("tipe/fetchDataTipe");
  },
};
</script>
