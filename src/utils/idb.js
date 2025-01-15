import { openDB } from "idb";

const dbPromise = openDB("easy-project", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("boards")) {
      db.createObjectStore("boards", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("columns")) {
      db.createObjectStore("columns", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("cards")) {
      db.createObjectStore("cards", { keyPath: "id", autoIncrement: true });
    }
  },
});

export const addData = async (storeName, data) => {
  const db = await dbPromise;
  return db.add(storeName, data);
};

export const getAllData = async (storeName) => {
  const db = await dbPromise;
  return db.getAll(storeName);
};

export const deleteData = async (storeName, key) => {
  const db = await dbPromise;
  return db.delete(storeName, key);
};

export const updateData = async (storeName, key, data) => {
  const db = await dbPromise;
  return db.put(storeName, { ...data, id: key });
};
