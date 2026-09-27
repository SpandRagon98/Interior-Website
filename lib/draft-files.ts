"use client";

const DB_NAME = "house-of-veya-draft"; const STORE = "files";
function openDb(): Promise<IDBDatabase> { return new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "name" }); }; request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
export async function saveDraftFiles(files: File[]) { const db = await openDb(); await new Promise<void>((resolve, reject) => { const tx = db.transaction(STORE, "readwrite"); const store = tx.objectStore(STORE); store.clear(); files.forEach((file) => store.put(file)); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); }); db.close(); }
export async function loadDraftFiles(): Promise<File[]> { const db = await openDb(); const files = await new Promise<File[]>((resolve, reject) => { const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll(); request.onsuccess = () => resolve(request.result as File[]); request.onerror = () => reject(request.error); }); db.close(); return files; }
export async function clearDraftFiles() { return saveDraftFiles([]); }
