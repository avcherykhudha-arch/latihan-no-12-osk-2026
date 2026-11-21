import { AcademySection } from '../types/physics';

export const ACADEMY_SECTIONS: AcademySection[] = [
  {
    id: 1,
    numberLabel: 'Bagian 01',
    title: 'Pengenalan Fenomena: Mengapa Konsumsi Bensin Tidak Bersifat Linier?',
    category: 'Fenomena & Intuisi Fisis',
    summary:
      'Memahami fenomena nyata ketika kendaraan yang membakar bahan bakar menjadi semakin ringan di sepanjang perjalanan.',
    contentParagraphs: [
      'Bayangkan Anda mengendarai sebuah mobil tangki atau kendaraan ekspedisi melintasi lintasan lurus yang sangat panjang dengan laju konstan. Pada awal perjalanan, tangki bahan bakar terisi penuh sehingga massa total mobil berada pada nilai maksimum, yaitu gabungan antara massa kosong kendaraan (termasuk pengemudi) dan massa bahan bakar awal.',
      'Di sepanjang jalan, ban mengalami gaya hambat gulir dan gesekan mekanis jalanan yang besarnya sebanding dengan gaya normal, yakni sebanding dengan berat total mobil saat itu. Ketika bahan bakar dibakar di ruang mesin untuk menghasilkan energi gerak, massa bahan bakar yang tersimpan di dalam tangki perlahan berkurang. Akibatnya, mobil menjadi semakin ringan dari kilometer ke kilometer berikutnya.',
      'Karena mobil semakin ringan, gaya hambat jalanan yang harus dilawan oleh mesin juga ikut mengecil secara kontinu. Dengan kata lain, satu kilogram bahan bakar terakhir yang dibakar saat tangki hampir kosong mampu mendorong mobil menempuh jarak yang lebih jauh dibandingkan satu kilogram bahan bakar pertama saat mobil masih berat dan penuh muatan.'
    ],
    diagramType: 'phenomenon',
    ttsScript:
      'Selamat datang di Akademi Konsep Fisika bersama Mister Jo. Pada bagian pertama, mari kita pahami fenomena inti dari Soal Nomor 12 OSK Fisika 2026. Ketika mobil bergerak dengan laju konstan sambil membakar bahan bakar, massa total mobil terus berkurang. Karena gaya hambat jalanan sebanding dengan berat total mobil, maka gaya hambat yang dilawan mesin pun ikut mengecil sepanjang perjalanan. Itulah sebabnya satu kilogram bensin di akhir perjalanan menghasilkan jarak tempuh lebih jauh daripada satu kilogram bensin di awal perjalanan.'
  },
  {
    id: 2,
    numberLabel: 'Bagian 02',
    title: 'Konsep Dasar, Besaran Fisika, dan Satuan SI',
    category: 'Fondasi Konseptual',
    summary:
      'Daftar lengkap besaran fisika yang terlibat dalam sistem kendaraan bermassa variabel beserta satuan Sistem Internasional (SI) dan konversinya.',
    contentParagraphs: [
      'Dalam menyelesaikan persoalan olimpiade fisika bertema usaha-energi pada sistem bermassa variabel, ketelitian membaca besaran dan mengonversi satuan merupakan syarat mutlak. Kesalahan paling klasik bukanlah pada integralnya, melainkan mencampurkan kilojoule dengan joule, atau meter dengan kilometer.',
      'Setiap persamaan mekanika dan energetika harus diturunkan serta dihitung menggunakan satuan dasar SI (kilogram, meter, sekon, newton, dan joule), baru kemudian hasil akhirnya dikonversi ke satuan yang diminta oleh soal seperti kilometer.'
    ],
    bullets: [
      'Massa kosong kendaraan termasuk pengemudi (m): dinyatakan dalam kilogram (kg).',
      'Massa bahan bakar awal (m_b): dinyatakan dalam kilogram (kg); massa total awal M_0 = m + m_b.',
      'Massa total sesaat (M): fungsi jarak atau waktu yang bernilai antara m hingga m + m_b (kg).',
      'Percepatan gravitasi (g): standar olimpiade OSK adalah 9,8 m/s² (kecuali dinyatakan lain dalam soal).',
      'Koefisien hambat jalanan (μ): besaran tak berdimensi (tanpa satuan) yang menghubungkan gaya hambat dengan gaya normal.',
      'Energi spesifik efektif bahan bakar (η): energi mekanik berguna yang dihasilkan per satuan massa bahan bakar, dalam J/kg (hati-hati: sering diberikan dalam kJ/kg, sehingga 1 kJ/kg = 1000 J/kg).',
      'Jarak tempuh (x): dalam meter (m) saat perhitungan SI, lalu dikonversi ke kilometer (1 km = 1000 m).'
    ],
    ttsScript:
      'Bagian kedua membahas besaran fisika dan satuan SI. Pastikan seluruh besaran seperti massa dalam kilogram, energi spesifik dalam joule per kilogram, serta percepatan gravitasi 9 koma 8 meter per sekon kuadrat digunakan secara konsisten sebelum hasil akhir jarak diubah menjadi kilometer.'
  },
  {
    id: 3,
    numberLabel: 'Bagian 03',
    title: 'Hukum Newton pada Gerak Laju Konstan & Diagram Gaya (FBD)',
    category: 'Hukum & Prinsip Fisika',
    summary:
      'Mengapa laju konstan berarti resultan gaya sama dengan nol, dan bagaimana hal tersebut menentukan besar gaya dorong mesin.',
    contentParagraphs: [
      'Meskipun mobil sedang bergerak maju menempuh ratusan kilometer, kata kunci "bergerak dengan laju konstan" pada lintasan lurus memberi informasi dinamis yang sangat kuat. Menurut Hukum I dan Hukum II Newton, percepatan benda bernilai nol apabila kecepatan konstan dalam besar maupun arah.',
      'Pada arah vertikal, gaya normal dari permukaan jalan tepat mengimbangi komponen berat kendaraan sehingga kendaraan tidak menembus jalan maupun melayang. Pada arah horizontal, gaya dorong traksi roda ke depan oleh mesin harus tepat sama besar dengan gaya hambat jalanan yang berarah ke belakang.'
    ],
    formula: {
      latex: '\\Sigma F_x = F_{\\text{mesin}} - f = 0 \\implies F_{\\text{mesin}} = \\mu M g',
      title: 'Keseimbangan Gaya pada Laju Konstan',
      variables: [
        { symbol: 'ΣF_x', meaning: 'Resultan gaya pada arah gerak', unit: 'N' },
        { symbol: 'F_mesin', meaning: 'Gaya dorong/traksi efektif dari mesin', unit: 'N' },
        { symbol: 'f', meaning: 'Gaya hambat jalanan', unit: 'N' },
        { symbol: 'μ', meaning: 'Koefisien hambatan gulir/jalanan', unit: 'tanpa satuan' },
        { symbol: 'M', meaning: 'Massa total kendaraan sesaat', unit: 'kg' },
        { symbol: 'g', meaning: 'Percepatan gravitasi', unit: 'm/s²' }
      ],
      mathMeaning:
        'Selisih antara gaya dorong maju dan gaya hambat mundur bernilai nol pada setiap titik posisi x.',
      physicsMeaning:
        'Seluruh usaha yang dilakukan mesin bukan digunakan untuk menambah energi kinetik mobil (ΔEk = 0), melainkan habis dipakai untuk mengatasi gaya disipatif hambatan jalanan.',
      conditions:
        'Berlaku pada lintasan datar lurus dengan laju konstan (percepatan nol) dan gaya hambat murni sebanding dengan gaya normal N = Mg.',
      limitations:
        'Jika jalan menanjak bersudut θ, gaya normal menjadi Mg cos θ dan muncul komponen berat Mg sin θ. Jika mobil dipercepat, ΣF_x = Ma tidak lagi nol.',
      applicationExample:
        'Untuk mobil bermassa sesaat 1000 kg dengan μ = 0,1 dan g = 9,8 m/s², gaya dorong konstan sesaat yang dibutuhkan adalah 0,1 × 1000 × 9,8 = 980 N.'
    },
    diagramType: 'forces-fbd',
    ttsScript:
      'Pada bagian ketiga, kita meninjau Hukum Newton untuk gerak laju konstan. Karena laju tetap dan lintasan lurus, percepatan bernilai nol sehingga sigma gaya sama dengan nol. Akibatnya, gaya dorong mesin tepat sama besar dengan gaya hambat jalanan yaitu miu dikali M dikali g. Energi bahan bakar tidak menambah energi kinetik, melainkan disalurkan untuk melawan gaya hambat ini.'
  },
  {
    id: 4,
    numberLabel: 'Bagian 04',
    title: 'Penurunan Rumus Jarak Maksimum Sistem Massa Variabel',
    category: 'Penurunan Matematis & Kalkulus',
    summary:
      'Penurunan langkah demi langkah persamaan integral logaritma natural yang menjadi jantung Soal Nomor 12 OSK 2026.',
    contentParagraphs: [
      'Mengapa kita tidak boleh langsung membagi energi total dengan gaya hambat awal μ(m + m_b)g? Karena massa M bukan konstanta, melainkan berubah seiring jarak tempuh x. Untuk menangani besaran yang berubah kontinu, kita menggunakan pendekatan elemen kecil (diferensial).',
      'Misalkan pada posisi x, massa total kendaraan adalah M. Ketika kendaraan bergerak sejauh elemen jarak yang sangat kecil dx, gaya hambat dapat dianggap tetap selama selang kecil itu sebesar f = μMg. Usaha mekanik kecil yang diperlukan adalah dW = μMg dx.',
      'Energi untuk melakukan usaha dW berasal dari pembakaran elemen massa bahan bakar dm_bakar. Karena seluruh massa bahan bakar yang terbakar mengurangi massa total kendaraan M, maka pertambahan massa kendaraan adalah dM = -dm_bakar (negatif, karena M berkurang). Jadi massa bahan bakar yang terbakar adalah -dM, dan energi yang dilepaskan adalah dE = η(-dM).'
    ],
    formula: {
      latex: 'x_{\\text{maks}} = \\frac{\\eta}{\\mu g} \\ln\\left(1 + \\frac{m_b}{m}\\right)',
      title: 'Persamaan Jarak Maksimum Massa Variabel (OSK 2026 #12)',
      variables: [
        { symbol: 'x_maks', meaning: 'Jarak maksimum yang ditempuh hingga bahan bakar habis', unit: 'm' },
        { symbol: 'η', meaning: 'Energi efektif yang dihasilkan per kg bahan bakar', unit: 'J/kg' },
        { symbol: 'μ', meaning: 'Koefisien hambat jalanan', unit: 'tanpa satuan' },
        { symbol: 'g', meaning: 'Percepatan gravitasi', unit: 'm/s²' },
        { symbol: 'm_b', meaning: 'Massa bahan bakar awal saat tangki penuh', unit: 'kg' },
        { symbol: 'm', meaning: 'Massa kendaraan kosong (termasuk pengemudi)', unit: 'kg' }
      ],
      mathMeaning:
        'Berasal dari pemisahan variabel dx = -(η / μg) · (dM / M) lalu diintegralkan dari batas bawah M = m + m_b hingga batas atas M = m.',
      physicsMeaning:
        'Jarak tempuh maksimum berbanding lurus dengan energi spesifik η, berbanding terbalik dengan koefisien hambat μ dan gravitasi g, serta bergantung secara logaritmik pada rasio massa awal terhadap massa kosong.',
      conditions:
        'Berlaku untuk lintasan datar, laju konstan, η konstan, μ konstan, tanpa gaya hambat udara tambahan, dan seluruh bahan bakar berkurang dari tangki secara kontinu.',
      limitations:
        'Apabila terdapat hambatan udara konstan F_0 atau kebocoran bahan bakar, bentuk integral berubah menjadi ln((μ(m+m_b)g + F_0) / (μmg + F_0)). Jika μ berubah terhadap posisi, ruas kanan ikut diintegralkan terhadap x.',
      applicationExample:
        'Jika m = 4m_b maka (m + m_b)/m = 1,25, sehingga jarak maksimumnya adalah (η / μg) ln(1,25).'
    },
    diagramType: 'work-integral',
    ttsScript:
      'Sekarang mari kita turunkan persamaan utama Soal 12. Dalam selang jarak sangat kecil dx, usaha yang dibutuhkan untuk melawan gaya hambat adalah miu M g dx. Energi tersebut berasal dari pembakaran massa bensin sebesar minus dM, yang menghasilkan energi eta dikali minus dM. Dengan memisahkan variabel dan mengintegralkan dari massa penuh m ditambah m b menuju massa kosong m, kita peroleh jarak maksimum sama dengan eta dibagi miu g, dikalikan logaritma natural dari satu ditambah m b dibagi m.'
  },
  {
    id: 5,
    numberLabel: 'Bagian 05',
    title: 'Analisis Hubungan Antarbesaran & Pendekatan Orde Pertama',
    category: 'Interpretasi Fisis Lanjutan',
    summary:
      'Membandingkan perilaku logaritmik terhadap pendekatan linier, serta memahami efek pertambahan bahan bakar atau muatan.',
    contentParagraphs: [
      'Perhatikan fungsi logaritma natural ln(1 + m_b/m). Ketika massa bahan bakar sangat kecil dibandingkan massa kendaraan kosong (m_b ≪ m), deret Taylor memberikan pendekatan ln(1 + u) ≈ u - u²/2. Pada orde pertama, persamaan massa variabel tereduksi kembali menjadi rumus sekolah menengah x ≈ (η m_b)/(μ m g)!',
      'Namun untuk kendaraan jarak jauh, roket darat, atau soal olimpiade di mana m_b tidak dapat diabaikan (misalnya m = 4 m_b sehingga m_b/m = 0,25), pendekatan linier dengan massa awal M_0 = m + m_b menghasilkan jawaban yang terlalu kecil, sedangkan pendekatan dengan massa kosong m menghasilkan jawaban yang terlalu besar. Nilai eksaknya selalu berada di antara keduanya.',
      'Implikasi menarik lainnya: menggandakan kapasitas tangki bahan bakar dari 200 kg menjadi 400 kg TIDAK menggandakan jarak tempuh! Karena tambahan bensin di awal justru menambah berat mobil di sepanjang bagian awal perjalanan.'
    ],
    diagramType: 'log-vs-linear',
    ttsScript:
      'Perhatikan makna fisis dari logaritma natural. Jika massa bensin jauh lebih kecil daripada massa mobil kosong, rumus logaritma ini menyusut menjadi rumus usaha konvensional. Namun pada kondisi olimpiade seperti m sama dengan 4 m b, menganggap massa mobil konstan akan menimbulkan galat puluhan kilometer. Menariknya lagi, menggandakan isi tangki tidak akan menggandakan jarak tempuh karena beban bahan bakar ekstra itu sendiri harus ikut diangkut di awal perjalanan.'
  },
  {
    id: 6,
    numberLabel: 'Bagian 06',
    title: 'Contoh Soal Bertahap: Sederhana, Menengah, dan Olimpiade (OSK 2026 #12)',
    category: 'Contoh Soal Terbimbing',
    summary:
      'Tiga contoh soal lengkap dari tingkat dasar hingga pembahasan penuh Soal Nomor 12 OSK Fisika 2026 sebagai tolok ukur penguasaan.',
    contentParagraphs: [
      'CONTOH 1 (SEDERHANA): Sebuah mobil uji bermassa total konstan 1000 kg melaju konstan melawan gaya hambat μMg dengan μ = 0,1 dan g = 9,8 m/s². Jika energi berguna yang tersedia 4900 kJ, jarak tempuhnya adalah x = E / (μMg) = 4.900.000 / (0,1 × 1000 × 9,8) = 5000 m = 5,0 km.',
      'CONTOH 2 (MENENGAH): Mobil bermassa kosong m = 1200 kg membawa bahan bakar m_b = 300 kg dengan energi efektif η = 1960 kJ/kg, μ = 0,1, g = 9,8 m/s². Menggunakan model massa variabel: η/(μg) = 1.960.000 / 0,98 = 2.000.000 m = 2000 km. Rasio massa (m + m_b)/m = 1500/1200 = 1,25. Maka x = 2000 × ln(1,25) ≈ 2000 × 0,22314 = 446,3 km.',
      'CONTOH 3 (OLIMPIADE — SOAL ASLI OSK FISIKA 2026 NOMOR 12): Mobil dengan massa total M bergerak laju konstan melawan gaya hambat f = -μMg (μ = 0,1). Saat kosong M = m, saat penuh M = m + m_b dengan m = 4 m_b. Energi per massa bensin η = 2197,3 kJ/kg, dan g = 9,8 m/s². Langkah penyelesaian: (1) Rasio massa penuh terhadap kosong adalah (m + m_b)/m = (4m_b + m_b)/(4m_b) = 5/4 = 1,25. (2) Faktor jarak karakteristik η/(μg) = 2.197.300 / (0,1 × 9,8) = 2.242.142,86 m ≈ 2242,14 km. (3) Kalikan dengan ln(1,25) ≈ 0,22314355, diperoleh x_maks = 2242,14286 × 0,22314355 = 500,3 km!'
    ],
    diagramType: 'osk-12-model',
    ttsScript:
      'Mari kita simak contoh soal olimpiade asli OSK Fisika 2026 Nomor 12. Diketahui koefisien miu sama dengan 0 koma 1, energi spesifik eta 2197 koma 3 kilojoule per kilogram, dan massa kosong m sama dengan 4 kali massa bensin. Perbandingan massa awal terhadap massa kosong adalah lima per empat atau 1 koma 25. Dengan percepatan gravitasi 9 koma 8 meter per sekon kuadrat, kita hitung eta dibagi miu g lalu dikalikan logaritma natural 1 koma 25, menghasilkan jarak maksimum 500 koma 3 kilometer.'
  },
  {
    id: 7,
    numberLabel: 'Bagian 07',
    title: 'Kesalahan Umum Siswa & Strategi Cepat Olimpiade',
    category: 'Taktik & Strategi OSK',
    summary:
      'Menghindari lima jebakan paling sering muncul pada soal sistem bermassa variabel serta trik aljabar cepat tanpa kalkulator.',
    contentParagraphs: [
      'Dalam pembinaan OSN Fisika, banyak peserta gagal meraih poin penuh pada soal seperti Nomor 12 bukan karena tidak tahu rumusnya, melainkan tergelincir pada detail teknis dan tanda matematis.',
      'Gunakan daftar periksa strategi cepat berikut setiap kali Anda menghadapi variasi soal konsumsi energi dan gaya hambat:'
    ],
    bullets: [
      'Jebakan 1 (Menganggap Massa Konstan): Langsung memakai E = η·m_b dan membagi dengan μ(m + m_b)g selalu menghasilkan jarak lebih pendek dari nilai sebenarnya.',
      'Jebakan 2 (Salah Tanda Integral): Menulis dE = +η dM tanpa tanda minus akan menghasilkan jarak negatif! Ingat M berkurang sehingga dM < 0 dan massa bensin terbakar adalah -dM.',
      'Jebakan 3 (Satuan kJ/kg vs J/kg): Selalu kalikan η dalam kJ/kg dengan 1000 sebelum membaginya dengan g (m/s²), lalu bagi hasil meter dengan 1000 untuk memperoleh km. Perhatikan trik cepat: 1 kJ/kg dibagi 1 m/s² langsung setara dengan 1 km!',
      'Jebakan 4 (Terbalik Rasio Logaritma): Pastikan argumen ln(...) lebih besar dari 1 untuk jarak positif, yaitu ln((m + m_b)/m), bukan ln(m/(m + m_b)).',
      'Strategi Cepat Kombinasi Hambatan: Jika ada tanjakan θ, cukup ganti μ menjadi μ_efektif = sin θ + μ cos θ. Jika ada hambatan konstan tambahan F_0 (seperti angin atau kebocoran), gunakan ln((μ M_0 g + F_0)/(μ m g + F_0)).'
    ],
    ttsScript:
      'Sebagai penutup akademi konsep, perhatikan trik cepat olimpiade dari Mister Jo. Pertama, satu kilojoule per kilogram dibagi satu meter per sekon kuadrat langsung menghasilkan satuan kilometer, sehingga Anda tidak perlu bingung dengan banyak angka nol. Kedua, jika ada tanjakan sudut teta, cukup ganti miu dengan sinus teta ditambah miu kosinus teta. Sekarang, Anda siap menaklukkan lima belas tantangan soal di Bank Soal!'
  }
];
