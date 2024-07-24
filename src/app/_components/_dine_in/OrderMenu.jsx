"use client";

import { useEffect, useState, useRef } from "react";
import { NumericFormat } from "react-number-format";
import { PiArrowUUpLeft } from "react-icons/pi";
import Image from "next/image";

function OrderMenu({ menu, onCloseSelectedProduct }) {
  const placeholderImage = "/dine_in/placeholder-image.png";

  function handleAddToCart() {
    onCloseSelectedProduct();
  }

  // Disable body scroll when OrderMenu is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-qrprimary/30 to-qraccent/5 backdrop-blur-sm">
      <div className="mx-14 min-h-[360px] w-full rounded-2xl bg-bcsecondary">
        <div className="relative h-330">
          <div
            className="flex justify-between"
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
              className="rounded-t-2xl"
            />
          </div>
          <PiArrowUUpLeft
            size="1.7rem"
            className="absolute top-3 left-4 text-bcprimary hover:drop-shadow-lg hover:size-8 duration-300 transition-all"
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
        <div className="flex items-center justify-between px-6 pb-5">
          <div>
            <p className="text-xs">Harga:</p>
            <p className="text-md font-semibold">
              <NumericFormat
                displayType="text"
                value={menu.price}
                prefix={"Rp."}
                thousandSeparator
              />
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddToCart()}
            className="rounded-md bg-qraccent px-3 py-2 text-xs text-bcsecondary transition-colors duration-300 focus:bg-qrprimary"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderMenu;
