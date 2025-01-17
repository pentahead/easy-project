import { openDB } from "idb";

const dbPromise = openDB("easy-project", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("boards")) {
      db.createObjectStore("boards", { keyPath: "id", autoIncrement: true });
    }
  },
});

export const addBoard = async (board) => {
  const db = await dbPromise;
  return db.add("boards", board);
};

export const getAllBoards = async () => {
  const db = await dbPromise;
  return db.getAll("boards");
};

export const getBoard = async (id) => {
  const db = await dbPromise;
  const tx = db.transaction("boards", "readonly");
  const store = tx.objectStore("boards");
  return store.get(id);
};

export const deleteBoard = async (id) => {
  const db = await dbPromise;
  return db.delete("boards", id);
};

export const updateBoard = async (id, board) => {
  const db = await dbPromise;
  return db.put("boards", { ...board, id });
};