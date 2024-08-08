import { useState } from 'react';

const MenuCard = ({ id, image, name, price, addToBill }) => {
  const [extras, setExtras] = useState({
    extraEspresso: 0,
    extraSyrup: 0
  });
  const [note, setNote] = useState('');

  const handleAddExtra = (extraType, event) => {
    event.stopPropagation();
    setExtras((prevExtras) => ({
      ...prevExtras,
      [extraType]: prevExtras[extraType] + 1
    }));
  };

  const handleAddToBill = () => {
    addToBill({ id, name, price, extras, note, quantity: 1 });
    // Reset extras and note after adding to the bill
    setExtras({
      extraEspresso: 0,
      extraSyrup: 0
    });
    setNote('');
  };

  const handleNoteChange = (event) => {
    event.stopPropagation();
    setNote(event.target.value);
  };

  return (
    <div
      className="border rounded-2xl p-4 flex flex-col items-center bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 transform lg:scale-100"
      onClick={handleAddToBill}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover rounded-xl mb-4" />
      <p>{id}</p>
      <h2 className="text-lg font-semibold text-center">{name}</h2>
      <p className="text-gray-700 font-medium text-center">Rp. {price.toLocaleString()}</p>
      <div className="mt-4 w-full">
        <textarea
          value={note}
          onClick={(e) => e.stopPropagation()}
          onChange={handleNoteChange}
          className="mt-4 w-full p-2 border rounded-xl focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Catatan..."
        />
      </div>
    </div>
  );
};

export default MenuCard;
