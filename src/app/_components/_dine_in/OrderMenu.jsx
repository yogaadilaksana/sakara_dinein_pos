"use client";

import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { PiArrowUUpLeft } from "react-icons/pi";
import Image from "next/image";

function OrderMenu({ menu, onCloseSelectedProduct, onSubmitProduct }) {
  const placeholderImage = "/dine_in/placeholder-image.png";
  const { id: id, name: name, price: price } = menu;
  const [quantity, setQuantity] = useState(1);

  // Disable body scroll when OrderMenu is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  function handleAddProdcut() {
    const newStoreProduct = {
      id,
      name,
      price,
      quantity,
    };

    onSubmitProduct(newStoreProduct);
  }

  function handleAddQty(id) {
    setQuantity((quantity) => quantity + 1);
  }

  function handleSubtractQty(id) {
    if (quantity < 2) {
      return;
    }
    setQuantity((quantity) => quantity - 1);
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-qrprimary/30 to-qraccent/5 backdrop-blur-sm">
      <div className="mx-14 min-h-[360px] w-full rounded-2xl bg-bcsecondary">
        <div className="relative h-330">
          <div
            className="items-center"
            style={{
              position: "relative",
              width: `${320}px`,
              height: `${240}px`,
            }}
          >
            <Image
              src={menu.image || placeholderImage}
              alt={menu.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-2xl sm"
            />
          </div>
          <PiArrowUUpLeft
            size="1.7rem"
            className="absolute top-3 left-4 text-bcprimary drop-shadow-sm"
            onClick={() => onCloseSelectedProduct()}
          />
        </div>
        <form className="px-8 py-4 tracking-wider">
          <div className="text-qrprimary">
            <p className="text-md font-semibold">{menu.name}</p>
            <p className="text-xs font-light">{menu.description}</p>
          </div>
          <div className="mt-4 text-xs">
            <input
              className="w-full rounded-md px-4 py-1 focus:outline-none focus:ring-1 focus:ring-qraccent/50"
              type="text"
              placeholder="Catatan..."
            />
          </div>
        </form>
        <div className="flex items-center justify-between px-8 pb-3">
          <div>
            <p className="text-xs">Harga:</p>
            <p className="text-md font-semibold">
              <NumericFormat
                displayType="text"
                value={menu.price * quantity}
                prefix={"Rp."}
                thousandSeparator
              />
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="border border-qraccent px-1 text-sm text-qraccent focus:bg-qraccent focus:text-bcprimary"
              onClick={() => handleSubtractQty()}
            >
              -
            </button>
            <p className="my-2 font-semibold">{quantity}</p>
            <button
              type="button"
              className="border border-qraccent px-1 text-sm text-qraccent focus:bg-qraccent focus:text-bcprimary"
              onClick={() => handleAddQty()}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-center mb-7 px-8">
          <button
            type="button"
            onClick={() => handleAddProdcut()}
            className="w-full rounded-md bg-qraccent px-3 py-2 text-sm text-bcsecondary transition-colors duration-300 focus:bg-qrprimary"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderMenu;