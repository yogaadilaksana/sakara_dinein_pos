import { useState } from 'react';

const Modal = ({ isOpen, onClose, onAddTable }) => {
    const [tableName, setTableName] = useState("");
  
    const handleAddTable = () => {
      if (tableName.trim() !== "") {
        onAddTable(tableName);
        setTableName("");
        onClose();
      }
    };
  
    return (
      isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Table</h2>
              <button onClick={onClose} className="text-gray-600">&times;</button>
            </div>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Table Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end">
              <button onClick={handleAddTable} className="bg-blue-900 text-white px-4 py-2 rounded-lg">
                Add Table
              </button>
            </div>
          </div>
        </div>
      )
    );
  };
  
  export default Modal;
  