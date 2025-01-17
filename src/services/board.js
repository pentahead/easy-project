import { addBoard as addData, updateBoard as updateData, deleteBoard as deleteData, getAllBoards as getAllData } from "../utils/idb";

export const addBoard = async (newBoard) => {
  try {
    await addData(newBoard);
    return { success: true };
  } catch (error) {
    console.error("Error adding board:", error);
    return { success: false, error: error.message };
  }
};

export const updateBoard = async (boardId, updatedBoard) => {
  try {
    await updateData(boardId, updatedBoard);
    return { success: true };
  } catch (error) {
    console.error("Error updating board:", error);
    return { success: false, error: error.message };
  }
};

export const deleteBoard = async (boardId) => {
  try {
    await deleteData(boardId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting board:", error);
    return { success: false, error: error.message };
  }
};

export const getAllBoards = async () => {
  try {
    const boards = await getAllData();
    return { success: true, data: boards };
  } catch (error) {
    console.error("Error fetching boards:", error);
    return { success: false, error: error.message };
  }
};