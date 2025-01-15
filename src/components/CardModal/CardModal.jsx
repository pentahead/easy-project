import React, { useState } from "react";

export default function CardModal({ isOpen, onClose, onAddCard }) {
  const [cardName, setCardName] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCard = {
      title: cardName,
      description,
      assignee,
      image,
    };
    onAddCard(newCard);
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Add Card</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Card Name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-2"
          />
          <button type="submit" className="bg-blue-500 text-white rounded p-2">
            Add Card
          </button>
          <button type="button" onClick={onClose} className="text-red-500 ml-2">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
