import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import XLSX from 'xlsx';
import { addSiswa, getAllSiswa, deleteSiswa, updateSiswa, getSiswaDetail, importSiswaFromExcel } from '../db/siswa';

export default function registerIPCHandlers() {
  ipcMain.handle('get-siswa', async () => {
    return await getAllSiswa();
  });

  ipcMain.handle('tambah-siswa', async (_event, data) => {
    return await addSiswa(data);
  });

  ipcMain.handle('hapus-siswa', async (_event, id: number) => {
    return await deleteSiswa(id);
  });

  ipcMain.handle('update-siswa', async (_event, data) => {
    return await updateSiswa(data);
  });

  ipcMain.handle('get-siswa-detail', async (_event, id: number) => {
    return await getSiswaDetail(id);
  });

  ipcMain.handle('import-excel', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
      properties: ['openFile']
    });

    if (canceled || filePaths.length === 0) {
      console.log('Import dibatalkan oleh pengguna');
      return;
    }

    const selectedFilePath = filePaths[0];

    if (!fs.existsSync(selectedFilePath)) {
      throw new Error('File tidak ditemukan');
    }

    const workbook = XLSX.readFile(selectedFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

    const normalizedData = rawData.map((row, i) => {
      const obj: Record<string, string> = {};
      try {
        Object.keys(row).forEach(key => {
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
          obj[normalizedKey] = row[key];
        });
      } catch (err) {
        console.error(`Kesalahan saat normalisasi baris ${i}:`, err);
      }
      return obj;
    });

    return await importSiswaFromExcel(normalizedData);
  });
}
