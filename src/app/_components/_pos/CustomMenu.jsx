import { useState } from 'react';

const CustomMenu = ({ addToBill }) => {
  const [menuName, setMenuName] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');

  const handleButtonClick = (btn) => {
    setPrice((prev) => prev + btn);
  };

  const handleDelete = () => {
    setPrice((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setMenuName('');
    setPrice('');
    setNote('');
  };

  const handleAddToBill = () => {
    if (menuName && price) {
      addToBill({
        name: menuName,
        price: parseInt(price.trim()),
        quantity: 1,
        type:"custom",
        extras: {
          extraEspresso: 0,
          extraSyrup: 0,
        },
        note: note.trim(),
      });
      handleClear();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
    <div className="bg-white rounded p-4 col-span-3">
      <div className="mb-4">
        <input
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="Nama Menu"
          className="w-full p-2 rounded border border-gray-300 text-center text-2xl"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={price}
          placeholder="Input Harga"
          readOnly
          className="w-full p-2 rounded border border-gray-300 text-center text-2xl"
        />
      </div>
      <div className="mb-4 hidden">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan (opsional)"
          className="w-full p-2 rounded border border-gray-300 text-center text-2xl"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, '+', 4, 5, 6, "x", 7, 8, 9, 'DEL', 0, '00'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === 'DEL') handleDelete();
              else if (btn === 'x') handleClear();
              else if (btn === '+') handleAddToBill();
              else handleButtonClick(btn.toString());
            }}
            className={`py-4 text-2xl ${
              btn ? 'bg-gray-200' : ''
            } rounded flex items-center justify-center`}
          >
            {btn}
          </button>
        ))}
        <button
          onClick={handleAddToBill}
          className="py-4 bg-blue-500 text-white rounded col-span-4"
        >
          Add to Bill
        </button>
      </div>
    </div>
  </div>
  );
};

export default CustomMenu;
