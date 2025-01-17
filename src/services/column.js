import { addData, getAllData, updateData, deleteData } from '../utils/idb';

export const ColumnService = {
  // Create new column
  create: async (columnData) => {
    try {
      const id = await addData('columns', {
        ...columnData,
        cards: [],
        createdAt: new Date().toISOString()
      });
      return { success: true, id };
    } catch (error) {
      console.error('Error creating column:', error);
      return { success: false, error: error.message };
    }
  },

  // Get columns by boardId
  getByBoardId: async (boardId) => {
    try {
      const columns = await getAllData('columns');
      const filteredColumns = columns.filter(column => column.boardId === boardId);
      return { success: true, data: filteredColumns };
    } catch (error) {
      console.error('Error fetching columns:', error);
      return { success: false, error: error.message };
    }
  },

  // Update column
  update: async (id, columnData) => {
    try {
      await updateData('columns', id, columnData);
      return { success: true };
    } catch (error) {
      console.error('Error updating column:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete column
  delete: async (id) => {
    try {
      await deleteData('columns', id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting column:', error);
      return { success: false, error: error.message };
    }
  }
};