import { addData, getAllData, updateData, deleteData } from "../utils/idb";

export const CardService = {
  // Create new card
  create: async (cardData) => {
    try {
      const id = await addData("cards", {
        ...cardData,
        createdAt: new Date().toISOString(),
        status: "active",
      });
      return { success: true, id };
    } catch (error) {
      console.error("Error creating card:", error);
      return { success: false, error: error.message };
    }
  },

  // Get cards by columnId
  getByColumnId: async (columnId) => {
    try {
      const cards = await getAllData("cards");
      const filteredCards = cards.filter((card) => card.columnId === columnId);
      return { success: true, data: filteredCards };
    } catch (error) {
      console.error("Error fetching cards:", error);
      return { success: false, error: error.message };
    }
  },

  // Update card
  update: async (id, cardData) => {
    try {
      await updateData("cards", id, cardData);
      return { success: true };
    } catch (error) {
      console.error("Error updating card:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete card
  delete: async (id) => {
    try {
      await deleteData("cards", id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting card:", error);
      return { success: false, error: error.message };
    }
  },

  // Move card to different column
  moveCard: async (cardId, newColumnId) => {
    try {
      const cards = await getAllData("cards");
      const card = cards.find((c) => c.id === cardId);
      if (!card) throw new Error("Card not found");

      await updateData("cards", cardId, {
        ...card,
        columnId: newColumnId,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error moving card:", error);
      return { success: false, error: error.message };
    }
  },
};
