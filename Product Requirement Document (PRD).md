# **Product Requirement Document (PRD)**

## **Nama Proyek: FitTrack AI \- Smart Calorie & Hybrid Workout Planner**

## **1\. Ringkasan Eksekutif & Objektif**

### **1.1 Latar Belakang**

Banyak penggiat olahraga mandiri di rumah kesulitan menyeimbangkan antara pengaturan nutrisi mikro/makro dan konsistensi jadwal latihan. Kombinasi latihan kekuatan kalistenik (*Front Lever* & *Dips*) dengan latihan kardio (*Running*) memerlukan manajemen pemulihan (*recovery*) yang ketat agar tidak terjadi *overtraining*. Di sisi lain, menghitung kalori harian secara manual sering kali terasa melelahkan, sehingga dibutuhkan solusi berbasis visual (foto) untuk mempermudah pelacakan asupan makanan.

### **1.2 Tujuan Utama (Product Goals)**

* **Optimalisasi Recomposisi Tubuh (Recomp):** Membantu pengguna memotong kadar lemak tubuh sekaligus membangun massa otot baru dengan rumus defisit kalori terukur dan asupan protein yang cukup.  
* **Penyederhanaan Pelacakan Nutrisi:** Menyediakan sistem *Photo-to-Calorie* berbasis AI untuk estimasi asupan nutrisi instan.  
* **Manajemen Latihan Terstruktur:** Menyediakan jadwal interaktif 5 hari latihan dan 2 hari istirahat yang menggabungkan perkembangan bertahap (*progressive overload*) untuk lari, dips, dan *Tuck Front Lever* bagi pemula.  
* **Visualisasi Progres yang Kuat:** Menampilkan grafik tren kalori, peningkatan performa lari, dan durasi ketahanan tubuh (*strength/hold time*).

## **2\. Pengguna Target (User Persona)**

* **Profil:** Pengguna olahraga rumahan (pemula hingga menengah dalam kalistenik) yang ingin menurunkan persentase lemak tubuh tanpa kehilangan massa otot.  
* **Kebutuhan Utama:**  
  * Metode pelacakan kalori yang cepat (tidak ribet mengetik satu per satu bahan makanan).  
  * Panduan perkembangan latihan *Front Lever* dari posisi pemula (*tuck*) ke posisi yang lebih lurus.  
  * Dashboard satu pintu yang menunjukkan apakah mereka sudah berolahraga dengan benar dan makan sesuai kuota kalori harian.

## **3\. Fitur Utama & Kebutuhan Fungsional**

### **Fitur A: AI Photo-to-Calorie Tracker (Modul Nutrisi)**

* **Fungsi:** Memungkinkan pengguna mengunggah foto makanan mereka untuk dianalisis oleh AI guna mendapatkan estimasi jumlah kalori dan makronutrien (Karbohidrat, Protein, Lemak).  
* **Spesifikasi Teknis UI:**  
  * Tombol "Ambil Foto/Unggah" pada dashboard nutrisi.  
  * Tampilan kartu hasil analisis yang menampilkan: nama makanan, perkiraan porsi (gram), kalori total (![][image1]), protein (![][image2]), karbohidrat (![][image3]), dan lemak (![][image4]).  
  * Tombol "Simpan ke Log Harian" untuk memotong jatah kalori hari ini.  
* **Formula Target Kalori Harian:**  
  * Target kalori dirancang untuk defisit kalori moderat agar pembakaran lemak optimal:  
    ![][image5]  
  * Target protein harian untuk menjaga massa otot saat defisit:  
    ![][image6]

### **Fitur B: Hybrid Workout Engine (Jadwal & Variasi Latihan)**

* **Fungsi:** Menyediakan program latihan dinamis berbasis 5 hari aktif dan 2 hari istirahat (*recovery*) dengan pelacakan set/reps/detik secara langsung di web.  
* **Skema Program Latihan Mingguan (5-Day Split):**  
  1. **Hari 1: Strength \- Pull & Push**  
     * *Tuck Front Lever Hold:* 4 Set x Max Detik (Target minimal akumulasi 30 detik).  
     * *Dips:* 4 Set x Repetisi Maksimal (RPE 8-9).  
     * *Lari:* HIIT Sprint (10 menit pemanasan, 5x sprint 30 detik selang-seling jalan kaki 1 menit).  
  2. **Hari 2: Cardio Endurance**  
     * *Lari Tempo:* 3-5 KM dengan kecepatan konstan (LISS).  
     * *Core Work:* Plank 3 Set x 1 Menit.  
  3. **Hari 3: REST / RECOVERY** (Fokus pada peregangan aktif).  
  4. **Hari 4: Strength & Volume**  
     * *Active Scapula Hangs & Tuck FL Hold:* 4 Set.  
     * *Dips (Fokus Eksentrik Lambat):* 4 Set x 8-12 Reps.  
     * *Lari Recovery:* 15-20 menit lari santai (jogging zona 2).  
  5. **Hari 5: Cardio & Core**  
     * *Lari Jarak Menengah:* Target perbaikan waktu tempuh (pace).  
     * *Core Work:* Leg Raises & Hollow Body Hold (Menunjang kekuatan *Front Lever*).  
  6. **Hari 6: Peak Performance**  
     * Uji coba waktu bertahan maksimal (*Max Hold*) untuk *Tuck Front Lever* dan jumlah repetisi maksimal (*Max Reps*) untuk *Dips*.  
     * *Lari:* Jogging santai 15 menit.  
  7. **Hari 7: REST / RECOVERY**  
* **Fitur Stopwatch Terintegrasi:** Tombol *timer* satu klik langsung di samping instruksi latihan *Tuck Front Lever* untuk mencatat durasi pegangan (*hold*) pengguna secara *real-time*.

### **Fitur C: Dashboard Analytics & Progress Charts (Modul Grafik)**

Web harus memvisualisasikan data log harian pengguna ke dalam 3 jenis grafik interaktif:

1. **Grafik Konsistensi Defisit Kalori (Bar/Line Chart):** Menampilkan perbandingan kalori masuk (![][image7]) terhadap batas target (![][image8]) dari hari ke hari.  
2. **Grafik Performa Lari (Line Chart multi-axis):** Menampilkan tren peningkatan jarak tempuh (KM) dan penurunan rata-rata *pace* (menit/KM).  
3. **Grafik Kekuatan / Progressive Overload (Dual Line Chart):**  
   * Garis A: Durasi maksimal bertahan (*hold time* dalam detik) pada latihan *Tuck Front Lever*.  
   * Garis B: Total repetisi maksimal dalam satu sesi latihan *Dips*.

## **4\. Alur Pengguna (User Flow)**

\[Mulai\]   
   │  
   ▼  
\[Dashboard Utama\]  
   ├───► Lihat Jadwal Hari Ini  
   │        ├───► Mulai Latihan kekuatan (Pakai Timer) ──► Catat Detik/Reps  
   │        └───► Selesai Lari ────────────────────────► Input Jarak & Waktu  
   │  
   ├───► Makan/Nutrisi Tracker  
   │        └───► Ambil Foto Makanan ──► AI Estimasi Kalori ──► Log Kalori Masuk  
   │  
   └───► Lihat Halaman Grafik   
            └───► Evaluasi Tren Kalori, Grafik Lari, & Grafik Kekuatan (Front Lever & Dips)

## **5\. Kebutuhan Non-Fungsional (Non-Functional Requirements)**

* **Responsivitas:** Tampilan web harus optimal digunakan di perangkat seluler (*Mobile-First Design*) karena pengguna akan membawa ponsel mereka saat berlari atau berlatih di dekat *pull-up bar*.  
* **Kecepatan Muat:** Grafik interaktif harus ringan dan dimuat kurang dari 2 detik (menggunakan library grafik berkinerja tinggi seperti Chart.js).  
* **Penyimpanan Lokal:** Untuk efisiensi versi awal (v1), seluruh progres kalori, latihan, dan waktu lari dapat disimpan langsung di memori browser pengguna (*Local Storage*) sehingga tidak memerlukan login/registrasi yang rumit di awal penggunaan.

## **6\. Rencana Pengembangan (Roadmap)**

* **Fase 1 (MVP \- Minimum Viable Product):** Pembuatan web satu halaman statis-dinamis menggunakan Tailwind CSS & JavaScript murni dengan grafik interaktif lokal, kalender jadwal latihan, serta simulator AI foto kalori (mockup responsif).  
* **Fase 2 (Sistem AI & Database Nyata):** Integrasi API deteksi gambar (seperti Google Gemini Vision API / LogMeal API) untuk membaca foto makanan asli secara otomatis dan integrasi database penyimpanan cloud (Supabase / Firebase).

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAaCAYAAADIUm6MAAABfklEQVR4Xu2WDc3CMBCGqwELaMACFrCABSzgAAlIwAEOcIABBECfbG/SHNd2ZBvpkj1J8+Xr9ee9nx4LYWVlZRvH3k6Gbr5JrnG84njH8ezHobcde3tzXOJ4hE7gpp/bhc6Rc+icwdYECEQsok7GloJ4ot8MpB7Rd2swYG+qTBDNqD06hDdTJjAk2oDomnN/g5oeEu0SdBzeSOl9/ALn8JbUHFzUKcbAJZyhljkFdLciCB9SJkTUiwCtcqzjHtxXBOG1FsevZ8456p42OSUEaFAwWIQDOUppwyHPnrZNdSICgJNkCQiYbOkZRLsacdDPu31cPNibmbOw17ZIgpCWFYL5n7WpQJxmLfY0woj2gvEFAjlE3yaq+/QbxYN97FEEhY0W53GOXatM69sIVCale7/gUKLOsGI8JMZi53DEdi/tVdD0hjTvNYLJyHWkdE6Pt1QO/NUeSjPXwSYDQbmUkjHvcuZq2WSNt3c0XDxHG5wd0k5KbTdZBGO+bVYWxQdT2GcS3v5+7gAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAAlElEQVR4XmNgGAVUB8pAfAIPngnEpnDVWIAQELsxQBT+B+IMKB+Eu4D4GVQcxMYLQAasRBeEApABIIwXXGeA2I4OQC4kaABMESg80AHIUIIGhDPgVgByGcEwgCmChTyMDwoTbK5CAUT5ER+AOf8zugSxABb/O9EliAHIzseb2nCBSgaEASDDSAIgP8M0UxSIo2BkAgBj5DCVekIApAAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAAuUlEQVR4Xu2TWw3DMAxFjaEUhqEURmEURqEUxqAQBmEMxmAMRqAAOh8lllLnIX9PPdKVqvgZxxU5iXBRXf1hhKdqU+2qb9Yt2+7m1GNVfSQ5TvlslpTwISlpBY4EYVycrYQkdFNBywS/vcGBHd8KghFDG0GC5gwi1YHgqgh3jlTv0p1sFBJE2ueV7FkPkKD5NAVs47AIVyBRD5ZriK2tXyIG+3JnTXCkRdt9m0v5D4Rg5+kC8X3y//wA8Rsr6qVaDlMAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAAlklEQVR4XmNgGAVUB8pAfIJIjBWADOgC4pVA/B+IZ0L5MAzif4bK4QUgA0AYFyBowDMgzkAXRAJ4DQB5A6QARCMDNyT2dSQ2BgDZjG6DEBofLwA5H2QALLRBtqEbiBPAnI+uAZ2PE8CcD4oqZEC0AbD434kmHo7GxwqQnY8eA0QBUCqDGUBSqIMALHkiY3wpcRSMAhQAADJhMIUahaKvAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA6CAYAAAAN3QXmAAAFXklEQVR4Xu3cga3cRBQF0F8DLVADLdACLdACLdABJVACHdABHaQBCoB/lVzxeMxuNtLfJLucI43+xvba47GluXr25uUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACe3Lev7afX9u61/fXafvywPH+z/Fl989q+v6Flu+nn1X54+WfbSzLGe7+nNu11u2Wfz6JjeQ/zWgHAw/nutf358t9QloDy7sO6Z/bHy/sxqEzoCaxTls1t6vfX9utalhCVcdv7mLIu22zpy+l7M0BPuWb3DCA5ZvqZMJr7Ieeac57St947+Zttp9w/DaH5/rX7Kdudzv+tpG+7/wDwEDJBXppEM2H/thc+kVSndkDI+e5ll6pYGbdTkEq4yz4ufS/rdtCLhK8dKBpiLu2rYegecn4NbNHx6jknxO3+5jutRqZvM1Bm+aV7Le4d2LL/3V8A+OqlonMtkGWCO1WWnsWurjUw7NBwCkWpJu3tpgSDUzg4BbAGoNMju+xjH+e033v45eXfgS2Ba1bU0o9dUcv63lP5vB8lZ92u5pbABgBLQsIODtspqDyTHY76OHRXgU6h9VSJmy4FthwjIWhq6DkF5B0gs02C5peQe2ZW0Objzkpfc36tMm45/1N1MXZgy7/bZvDLPdvx3YEx1yXLEwp3WBTYAHg4mVRPE+r/WatZ16qOlbBybfwSqk7hIMsaWBIoTsFi2oEt+03l63NLSMo5z0CZfp0CW5efxuf02Lf2d7qvbN/jNjT2Rx5ZPyt++dxQu4O3wAbAQ+njvNOE+ihm9eVa2xWrazom16qOle3e7YUfJExkfcLF1IDR/effl/ZR2b4Br++QXQt499IQNM+pwWzqGPZct1sDW67bHr+YAS0SrnuNM+7z2u1rmf1fOjYAfHX66O80oU6fEnaewbUQts0gtWX5KVidfoE6A8R+RBvZfgaX+Th0h6Wp78N9rO0+XtN32NqfewW2/nJ56/H3MbeEtI713FZgA+ChZML9WGDLxDaDwmkCvYdbj5PJ95b2KaFzh6NLrv0KtEHh9J7Zx8Z8B5Hs691aVunnvcNHHr3uHwjMc8g57nfIsi79arjagTBh9hRMYwa2HHefX8d9j1PkOOnP3PfeVmAD4KH00dq18LAntlve63oLtx4n/bu13aJh4RTCtoSJS0EqgXO/61XXxvzHveDlfd8vVfFy/NN33lL7u99b6zmcwlfW9R279HGHq5zTDnnVa1D5fAqMp+83KE8NbB0ngQ2Ah9OKRCbdWQXJBLmrQwkxc9KeL713Asw2fXdrTp59sT66rseuTur7OJ9Ljp9wkT7tgLFlfQJZxiCf2zIOOb9dUaqGkRkY+t0sn5XFjEPfM5yhrO91pa87KN1Dr1e1rzMwzV+N9tebleXz370/Luk5NzQnvO/j5RrNfWSbrM+4zPHvf9Kbde1D7+1bQjkAfDX62CoTWybmTH4JIjt0zNCwqyANXgkT+W4mx0yIDT7zPalOvvP9ollBuXfFaGtAOLWTBohTS0C4FDb3tqc2Q/Bed2r7Gt1Drkfujd4XDUBTrn8DZP7ufuU7uSeyvkH3knl+vUfaGrqy/4x1jpVl855pH3q8PkLtO4V7/wDwVDIJRitJnTxbMWk4m58ry6rhLn9PE+Y8DgAAn6AVnVQqWkWLVF4Svvqe1QxnlW2iFbgum5WWVqbmcQAAeCPzEdh+HDalGrfXe5cIAOALy2PPWVUDAOArlPfRVNIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIfxN1oztn7sVvjWAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,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>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAAaCAYAAACn4zKhAAACyklEQVR4Xu2WC20bQRRFB0MpFEMolEIplEIphEEgBEIZlEEZlEABtD5yjvJ09WbXdrxSLc2RRvbO9/1nxlgsFovF4jq+nNqn6MvvxQF8O7Vfp/a3tNdxNj7t8/vUi3g6tZ9vjb2OBNkePkgwGIZ6efsvOOHHODvnWjAKGfV7HOsEzmB/znlIiP49Bb6P242II/b2vwc1cB4KBP8zzkYimmYYabfwdbyXtUWDtXrPQJaUGVtRSHnjDDJuBuu7+yb3zW9gXbe2Ylncgj26/Q/Hy/cSATsjPo+zc3AmvziTyK940XeGYr7rmVeNwHz6GKefuXxzP1XoI5uRpYP1zFHGxADzAZHyH84lWTCDdem8dOisFGFgDJevGeZiTPoxjPeVhuc/68A5szune5F1Bq5zcHY6mW/27s64Cyp9LRg6FYTsm5WizkBAH2NmHs6jT+Pxa0Y5R0dVPezTaM7tjKiT2duneKIe3diHYeOM5gThEKKC0GlEFMWAla4U8Z++XA8aRFy/pXx3hvLVMoOTupKoLDOZgDNoh8ChGaUJCqSjfFFV2CezSkNUfO52StHPeP3u5lWYk84307rykyA3TlOnvJwtdxmId4PNu9osGLCLHmukWJ8Bh9UarpOt5d4T6TCUzIC4xJDMsYwog5mQwVMxGCqcn/pmKWIc2dVD9s6b4gFEWx6OQBkVghAKgHCs18jUcY2pYAhcL2eMVTPEGp5U5WeYBchkFnEma2tWZblkTJlBPZIsRT6nsZ39ltiZvXZRGKPTZ2O+aCoIjEIIwlyMSGNNVZR9icrMKIRFAc7jlzVdFGWZ6fCMlBd5GENG9skz1MGGjF3JwS5dv/JDOvQmEIhoNc32ok/ScPnNPvTN9mMsM7AyW1fBoVsRuHU+MJ5yV7qSyH61/OAQHLV1zuIDdCWx3ge1FNXytzgYnJKO2crGxWKxWCwW/zP/AOqj+VOSbP85AAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAaCAYAAAAT6cSuAAABo0lEQVR4Xu2WDU3EQBCFqwELaMACFrCABSycg5NwEnCAAxxgAAGwX9qXvEy27TYppXPZL5n0rtvu7puf7QxDp9M5G4/Fnos9Ve6n5Vbsu9hPsa/JXqax12k8Jddin8Mo4sHuI/YyjIIZSwMiEMTG38KYg0CimArSDGEfcSDAeLqURBi2dlAgLlVKQkvUAGFrDjgV1FhL1FKiE3ArfBr+43AhCBxsTcFAXEtKcpr6p4GD5d3+HwWlgbgmENcSgegA3ln6bPwVm51KWiJyjtrxH71HZH0O/cbTtHA0B0QeJ/GsxnCSMsLLw9ekBJiPVOSZ2A4uolYrRoLJ8FJNXPQec2iTXBEEatskiPuqF3U9wp9hP1xxAGsx56aUFCyGR9VLqg69p4xER7jY+A4bqx1aMQpEF7zNk5Ngc0o6LMSmsaXQ4wyNS4hHQJv06M2JEzhAc/F+rHHwOmduP+B2Q5tGoETpyoKKuLqZuc3GGtNmEaAUBaWnUpXnaqWyGzGyLBjviZZvkosRtfk8TU+LpzbXWtqmBUGkGkbUlMJ3AymWIs06R/ELg2VrT0I+htkAAAAASUVORK5CYII=>