# assignment-aidilafif

🧮 Kalkulator Properti Panel CLT

Kalkulator berbasis web untuk menganalisis properti panel Cross-Laminated Timber (CLT) menggunakan metode Shear Analogy dan Gamma. Dibangun dengan prinsip Pemrograman Berorientasi Objek (OOP) dan antarmuka responsif yang bersih.

📋 Fitur Utama

- Manajemen Layer: Tambah, hapus, dan reset layer secara real-time
- Dua Metode Analitik:
  - Shear Analogy (3-9 layer, simetris dari atas ke bawah)
  - Gamma (3 atau 5 layer)
- Validasi Otomatis: Pengecekan jumlah layer dan simetri
- Struktur Data OOP: CLTLayerType, CLTLayupType, PanelPropertiesType
- Perhitungan: EIeff (kekakuan lentur) dan GAeff (kekakuan geser)
- Tampilan Dinamis: Output menyesuaikan dengan metode yang dipilih

🏗️ Struktur Data

- CLTLayerType: Properti per layer (ketebalan, orientasi 0°/30°/60°/90°, material MGP10)
- CLTLayupType: Kombinasi layer dengan metode analitik
- PanelPropertiesType: Hasil perhitungan (total ketebalan, EIeff, GAeff, faktor gamma)

🚀 Cara Penggunaan

- Atur Layer: Tentukan ketebalan dan orientasi setiap layer
- Pilih Metode: Shear Analogy atau Gamma
- Kalkulasi: Klik tombol Calculate atau otomatis saat parameter berubah
- Lihat Hasil: Properti panel ditampilkan secara instan

👥 Kontributor

- @NurAfianto - https://github.com/NurAfianto
- @ikhsan017 - https://github.com/ikhsan017
