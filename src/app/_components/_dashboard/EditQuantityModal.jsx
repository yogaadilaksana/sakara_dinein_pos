"use client";

import { FiX } from "react-icons/fi";
import { FaSquarePlus, FaSquareMinus } from "react-icons/fa6";
import { useState } from "react";
import useToggleUiStore from "@/app/_stores/store";

const EditQuantityModal = ()=> {
  const {
    isModalOpen,
    setCloseModal,
    itemName,
    itemQty,
    addItemQty,
    subtractItemQty,
    inputItemQty,
  } = useToggleUiStore();
  console.log(itemQty);
  // const [quantity, setQuantity] = useState(itemQty);

  const handleAddQty = () => {
    addItemQty();
  };

  const handleSubtractQty = () => {
    if (itemQty === 0) return;
    subtractItemQty();
  };

  const handleInputQty = (e) => {
    // e.preventDefault();
    const value = e.target.value;

    if (value >= 0) {
      inputItemQty(value);
    }
  };

  const handleCloseModal = () => {
    setCloseModal();
  };

  if (!isModalOpen) return;

  return (
    <div className="z-50 absolute inset-0 flex items-center justify-center -mt-[300px] text-dpaccent backdrop-blur-sm">
      <form className="bg-bcsecondary md:w-[500px] w-[360px] rounded-lg border shadow-xl">
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <button type="button" onClick={() => handleCloseModal()}>
            <FiX className="text-error/60 hover:text-error transition-colors duration-300" />
          </button>
          <h3 className="text-xs text-dpaccent/40">Ubah Jumlah</h3>
          <button
            type="button"
            className="float-end px-3 py-1 rounded-md bg-dpprimary hover:bg-dpaccent transition-colors duration-300 text-bcprimary text-xs"
            // onSubmit={""}
          >
            Simpan
          </button>
        </div>
        <div className="flex justify-between items-center px-10 py-4">
          <p>{itemName}</p>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => handleSubtractQty()}
              type="button"
              className="text-dpaccent hover:text-dpprimary transition-colors duration-300"
            >
              <FaSquareMinus size="1rem" />
            </button>
            {/* Stok sekarang */}
            <input
              type="number"
              value={itemQty}
              placeholder={0}
              onChange={handleInputQty}
              className="w-7 text-center bg-bcsecondary"
            />
            <button
              onClick={() => handleAddQty()}
              type="button"
              className="text-dpaccent hover:text-dpprimary transition-colors duration-300"
            >
              <FaSquarePlus size="1rem" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditQuantityModal;
