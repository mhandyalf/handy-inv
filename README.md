# Handy Invitation

Undangan pernikahan statis yang responsif, terinspirasi dari tampilan Invisimple.

## Menjalankan lokal

```bash
python3 -m http.server 8080
```

Buka `http://localhost:8080/?to=Handy`. Nama tamu dapat diganti lewat parameter `to`.

## Catatan

- Ucapan tersimpan lokal di browser (`localStorage`), bukan di server.
- Musik dan beberapa gambar masih memakai URL publik situs referensi.
- Semua teks acara dapat diubah langsung di `index.html`.
