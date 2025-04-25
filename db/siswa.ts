import { Database } from 'sqlite3';
import { Siswa } from '../types/siswa';

// Membuka atau membuat database SQLite
const db = new Database('./db/siswa.db');

// Fungsi untuk mengambil semua siswa
export function getAllSiswa(): Promise<Siswa[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM siswa', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

// Fungsi untuk menambah siswa
export function addSiswa(data: Siswa): Promise<void> {
  return new Promise((resolve, reject) => {
    const { nama, nisn, jurusan } = data;
    db.run('INSERT INTO siswa (nama, nisn, jurusan) VALUES (?, ?, ?)', [nama, nisn, jurusan], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

// Fungsi untuk menghapus siswa
export function deleteSiswa(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM siswa WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

// Fungsi untuk memperbarui siswa
export function updateSiswa(data: Siswa): Promise<void> {
  return new Promise((resolve, reject) => {
    const { id, nama, nisn, jurusan } = data;
    db.run('UPDATE siswa SET nama = ?, nisn = ?, jurusan = ? WHERE id = ?', [nama, nisn, jurusan, id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

// Fungsi untuk mengambil detail siswa
export function getSiswaDetail(id: number): Promise<Siswa> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM siswa WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}

// Fungsi untuk mengimpor data siswa dari file Excel
export function importSiswaFromExcel(data: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO siswa (nama, nisn, jurusan) VALUES (?, ?, ?)');
    data.forEach(row => {
      stmt.run(row.nama, row.nisn, row.jurusan);
    });
    stmt.finalize((err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
