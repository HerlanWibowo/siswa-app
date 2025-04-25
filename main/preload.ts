import { contextBridge, ipcRenderer } from 'electron';
import { Siswa } from '../types/siswa';

contextBridge.exposeInMainWorld('electron', {
  getSiswa: () => ipcRenderer.invoke('get-siswa'),
  tambahSiswa: (data: Siswa) => ipcRenderer.invoke('tambah-siswa', data),
  hapusSiswa: (id: number) => ipcRenderer.invoke('hapus-siswa', id),
  updateSiswa: (data: Siswa) => ipcRenderer.invoke('update-siswa', data),
  getSiswaDetail: (id: number) => ipcRenderer.invoke('get-siswa-detail', id),
  importExcel: () => ipcRenderer.invoke('import-excel')
});
