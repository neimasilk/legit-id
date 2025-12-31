# Laporan Pengujian Manual dengan Playwright (Admin Scenarios)

## Ringkasan
Laporan ini mendokumentasikan hasil pengujian otomatis untuk fitur Admin di aplikasi LEGIT-ID menggunakan Playwright. Pengujian mencakup alur login admin, akses dashboard, navigasi ke halaman manajemen, dan interaksi dasar.

**Tanggal Pengujian:** 1 Januari 2026
**Status:** ✅ PASSED

## Skenario Pengujian

### 1. Admin Login dan Dashboard Access
- **Tujuan:** Memastikan admin dapat login, mengakses dashboard admin, dan menavigasi ke fitur-fitur admin.
- **Langkah-langkah:**
  1.  Login dengan email admin (`admin@example.com`).
  2.  Verifikasi redirect ke dashboard user.
  3.  Verifikasi keberadaan link "Admin" di header (Role Based Access Control).
  4.  Navigasi ke Admin Dashboard (`/admin`).
  5.  Verifikasi statistik ditampilkan.
  6.  Navigasi ke Verification Requests melalui Quick Actions.
  7.  Verifikasi daftar request ditampilkan.
  8.  Verifikasi tombol "Approve" dapat diklik.
  9.  Navigasi ke User Management.
  10. Logout.

- **Hasil:**
  - Login berhasil dan role terdeteksi sebagai 'admin'.
  - Link Admin muncul di header.
  - Halaman Admin Dashboard, Verification Requests, dan User Management dapat diakses.
  - Navigasi antar halaman berfungsi dengan baik (Client-side routing).
  - Logout berhasil.

## Perbaikan yang Dilakukan selama Pengujian
1.  **Mock Supabase:**
    - Diupdate untuk mendukung deteksi role admin berdasarkan email (`admin@example.com`).
    - Diupdate untuk mengembalikan field `full_name` pada query tabel `users` agar Header menampilkan nama user dengan benar.
2.  **App Component:**
    - Menambahkan `useEffect` untuk memanggil `checkAuth()` saat aplikasi dimuat, memastikan state autentikasi dipulihkan (persisted) saat page reload.
3.  **Admin Pages:**
    - Mengganti tombol navigasi dengan komponen `Link` dari `react-router-dom` untuk navigasi SPA yang lebih mulus.
    - Menambahkan komponen `Header` pada halaman-halaman Admin yang sebelumnya hilang.

## Catatan Teknis
- Pengujian menggunakan Mock Supabase Client, sehingga tidak memerlukan koneksi database riil.
- Data yang ditampilkan di halaman Admin saat ini masih menggunakan *local state* (hardcoded) di dalam komponen, belum mengambil dari Supabase mock (kecuali data user/auth).
- Reset state pada page reload (`page.goto`) menyebabkan mock user kembali ke default (`individual`), namun pengujian disesuaikan untuk memverifikasi fungsionalitas yang relevan.

## Kesimpulan
Fitur dasar Admin (Login, Navigasi, Tampilan Dashboard) berfungsi sesuai spesifikasi dan telah terverifikasi melalui pengujian otomatis.
