import { useState } from 'react';

const MenuCard = ({ image, name, price, addToBill }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity(quantity + 1);
    addToBill({ name, price, quantity: quantity + 1 });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img src={image} alt={name} className="h-32 w-full object-cover rounded-lg"/>
      <div className="mt-4">
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-gray-500">Rp. {price}</div>
        <div className="flex justify-between mt-2">
          <button className="bg-gray-200 px-2 py-1 rounded">Extra Espresso</button>
          <button className="bg-gray-200 px-2 py-1 rounded">Extra Syrup</button>
        </div>
        <textarea placeholder="catatan..." className="w-full mt-2 px-2 py-1 border rounded-lg"></textarea>
        <div className="flex justify-between mt-2">
          <button onClick={handleAdd} className="bg-blue-900 text-white px-4 py-2 rounded-lg">Add</button>
          <div className="text-lg font-semibold">{quantity}</div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
