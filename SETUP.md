# Setup Guide - Sistem Magang

## Database Configuration

### Mode 1: Dengan Perusahaan (Default)
Jika database Anda memiliki kolom `perusahaan_id` di tabel `lowongan`:

```bash
# Tidak perlu set environment variable (default)
npm start
```

### Mode 2: Tanpa Perusahaan
Jika database Anda TIDAK memiliki kolom `perusahaan_id`:

```bash
# Set environment variable
SUPPORT_PERUSAHAAN=false npm start
```

Atau buat file `.env`:
```
SUPPORT_PERUSAHAAN=false
```

## Perbedaan Struktur Database

### Dengan Perusahaan (Versi Lengkap)
- Tabel `lowongan` memiliki kolom `perusahaan_id`
- Tabel `perusahaan` untuk menyimpan data perusahaan
- Fitur lengkap dengan manajemen perusahaan

### Tanpa Perusahaan (Versi Sederhana)
- Tabel `lowongan` TIDAK memiliki kolom `perusahaan_id`
- Data perusahaan disimpan langsung di tabel `lowongan`
- Fitur dasar tanpa manajemen perusahaan terpisah

## Migration Guide

### Dari Versi Tanpa Perusahaan ke Dengan Perusahaan

1. Jalankan migration untuk menambah kolom:
```bash
npx sequelize-cli migration:generate --name add-perusahaan-id-to-lowongan
```

2. Isi migration:
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('lowongan', 'perusahaan_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'perusahaan',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('lowongan', 'perusahaan_id');
  }
};
```

3. Jalankan migration:
```bash
npx sequelize-cli db:migrate
```

## Seeder Compatibility

### Seeder dengan Perusahaan
- File: `20250622014457-sistem-magang.js` (versi lengkap)
- Menyertakan data perusahaan dan lowongan dengan `perusahaan_id`

### Seeder tanpa Perusahaan  
- File: `20250621093828-proyek-magang.js` (versi teman)
- Data perusahaan disimpan langsung di tabel lowongan

## Troubleshooting

### Error: "Unknown column 'perusahaan_id'"
Solusi: Set `SUPPORT_PERUSAHAAN=false`

### Error: "Table 'perusahaan' doesn't exist"
Solusi: Jalankan migration untuk membuat tabel perusahaan atau set `SUPPORT_PERUSAHAAN=false` 