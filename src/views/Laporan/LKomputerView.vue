<template>
  <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card flat class="border mb-4">
      <div class="d-flex justify-space-between">
        <v-card-title>Data Komputer</v-card-title>

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
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn color="green" @click="exportDataToExcel"
                >Kirim Ke Excel</v-btn
              >
            </v-col>

            <v-col cols="auto">
              <v-btn
                color="primary"
                append-icon="mdi-printer"
                @click="printAllData"
                >Cetak Semua Data</v-btn
              >
            </v-col>
          </v-row>
        </v-card-title>
      </div>
      <v-table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID Barang</th>
            <th>Merk</th>
            <th>Kategory</th>
            <th>Spek Device</th>
            <th>Ruangan</th>
            <th>Urutan Meja</th>
            <th>Kondisi</th>
            <th>Tanggal masuk</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(Lkomputer, index) in filteredData" :key="Lkomputer.id">
            <td>{{ index + 1 }}</td>
            <td>{{ Lkomputer.id }}</td>
            <td>{{ Lkomputer.nama_merk }}</td>
            <td>{{ Lkomputer.tipe_barang }}</td>
            <td>{{ Lkomputer.spek }}</td>
            <td>{{ Lkomputer.nama_ruangan }}</td>
            <td>{{ Lkomputer.urutan_meja }}</td>
            <td>
              <v-chip :color="getKondisiChipColor(Lkomputer.kondisi)" dark>
                {{ Lkomputer.kondisi }}
              </v-chip>
            </td>
            <td>
              {{ convertISOtoDate(Lkomputer.created_at) }}
            </td>
            <td>
              <v-icon @click="printData(Lkomputer)">mdi-printer</v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script>
import * as XLSX from "xlsx";
import moment from "moment";
import "moment/locale/id"; // Impor bahasa Indonesia

import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("Lkomputer", ["getDataKomputer"]),
    filteredData() {
      const searchLowerCase = this.search.toLowerCase();
      return this.getDataKomputer.filter((Lkomputer) => {
        return (
          (typeof Lkomputer.id === "string" &&
            Lkomputer.id.toLowerCase().includes(searchLowerCase)) ||
          (Lkomputer.nama_merk &&
            Lkomputer.nama_merk.toLowerCase().includes(searchLowerCase)) ||
          (Lkomputer.tipe_barang &&
            Lkomputer.tipe_barang.toLowerCase().includes(searchLowerCase)) ||
          (Lkomputer.spek &&
            Lkomputer.spek.toLowerCase().includes(searchLowerCase)) ||
          (Lkomputer.nama_ruangan &&
            Lkomputer.nama_ruangan.toLowerCase().includes(searchLowerCase)) ||
          (Lkomputer.urutan_meja &&
            Lkomputer.urutan_meja.toLowerCase().includes(searchLowerCase)) ||
          (Lkomputer.kondisi &&
            Lkomputer.kondisi.toLowerCase().includes(searchLowerCase)) ||
          (Lkomputer.created_at &&
            this.formatDate(Lkomputer.created_at).includes(searchLowerCase))
        );
      });
    },
  },
  methods: {
    ...mapActions("Lkomputer", ["fetchDataKomputer"]),
    convertISOtoDate(isoString) {
      return moment.utc(isoString).locale("id").format("DD MMM YYYY");
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
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en-US", options).toLowerCase();
    },
    printData(Lkomputer) {
      console.log(Lkomputer);
      // Membuat dokumen baru untuk mencetak data individu
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(
        "<html><head><title>Cetak Data</title></head><body>"
      );

      // Menambahkan konten data ke dokumen cetak
      printWindow.document.write("<h1>Data Komputer</h1>");
      printWindow.document.write('<table border="1">');
      printWindow.document.write(
        "<tr><th>ID Barang</th><th>Merk</th><th>Kategory</th><th>Spek Device</th><th>Ruangan</th><th>Urutan Meja</th><th>Kondisi</th><th>Tanggal Masuk</th></tr>"
      );
      printWindow.document.write("<tr>");
      printWindow.document.write("<td>" + Lkomputer.id + "</td>");
      printWindow.document.write("<td>" + Lkomputer.nama_merk + "</td>");
      printWindow.document.write("<td>" + Lkomputer.tipe_barang + "</td>");
      printWindow.document.write("<td>" + Lkomputer.spek + "</td>");
      printWindow.document.write("<td>" + Lkomputer.nama_ruangan + "</td>");
      printWindow.document.write("<td>" + Lkomputer.urutan_meja + "</td>");
      printWindow.document.write("<td>" + Lkomputer.kondisi + "</td>");
      printWindow.document.write(
        "<td>" + this.convertISOtoDate(Lkomputer.created_at) + "</td>"
      );
      printWindow.document.write("</tr>");
      printWindow.document.write("</table>");

      printWindow.document.write("</body></html>");
      printWindow.document.close();

      // Memanggil fungsi pencetakan bawaan browser
      printWindow.print();
      printWindow.close();
    },
    printAllData() {
      const dataToPrint = this.getDataKomputer; // Mengambil semua data komputer dari Vuex store

      // Membuat dokumen baru untuk mencetak semua data
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(
        "<html><head><title>Cetak Semua Data</title></head><body>"
      );

      // Menambahkan konten data ke dokumen cetak
      printWindow.document.write("<h1>Data Komputer</h1>");
      printWindow.document.write('<table border="1">');
      printWindow.document.write(
        "<tr><th>No</th><th>ID Barang</th><th>Merk</th><th>Kategori</th><th>Spek Device</th><th>Ruangan</th><th>Urutan Meja</th><th>Kondisi</th><th>Tanggal Masuk</th></tr>"
      );

      dataToPrint.forEach((Lkomputer, index) => {
        printWindow.document.write("<tr>");
        printWindow.document.write("<td>" + (index + 1) + "</td>");
        printWindow.document.write("<td>" + Lkomputer.id + "</td>");
        printWindow.document.write("<td>" + Lkomputer.nama_merk + "</td>");
        printWindow.document.write("<td>" + Lkomputer.tipe_barang + "</td>");
        printWindow.document.write("<td>" + Lkomputer.spek + "</td>");
        printWindow.document.write("<td>" + Lkomputer.nama_ruangan + "</td>");
        printWindow.document.write("<td>" + Lkomputer.urutan_meja + "</td>");
        printWindow.document.write("<td>" + Lkomputer.kondisi + "</td>");
        printWindow.document.write(
          "<td>" + this.convertISOtoDate(Lkomputer.created_at) + "</td>"
        );
        printWindow.document.write("</tr>");
      });

      printWindow.document.write("</table>");
      printWindow.document.write("</body></html>");
      printWindow.document.close();

      // Memanggil fungsi pencetakan bawaan browser
      printWindow.print();
      printWindow.close();
    },
    exportDataToExcel() {
      const data = this.getDataKomputer.map((komputer, index) => ({
        No: index + 1,
        "ID Barang": komputer.id,
        Merk: komputer.nama_merk,
        Kategory: komputer.tipe_barang,
        "Spek Device": `${komputer.spek}`,
        Ruangan: komputer.nama_ruangan,
        "Urutan Meja": komputer.urutan_meja,
        Kondisi: komputer.kondisi,
        "Tanggal Masuk": komputer.created_at,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);

      // Tambahkan header
      const header = [
        "No",
        "ID Barang",
        "Merk",
        "Kategory",
        "Spek Device",
        "Ruangan",
        "Urutan Meja",
        "Kondisi",
        "Tanggal Masuk",
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });

      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      const fileName = "data_komputer.xlsx";
      if (window.navigator.msSaveOrOpenBlob) {
        // For IE
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        // For other browsers
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    },
  },
  data: () => {
    return {
      search: "",
      items: [
        {
          title: "Laporan",
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
    this.$store.dispatch("Lkomputer/fetchDataKomputer");
  },
};
</script>
<style scoped>
@media print {
  /* Gaya khusus untuk pencetakan */
  body {
    font-size: 12pt; /* Contoh: ubah ukuran font sesuai kebutuhan Anda */
    /* Tambahkan gaya lainnya sesuai kebutuhan Anda */
  }
}
</style>
