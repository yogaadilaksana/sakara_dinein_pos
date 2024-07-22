"use client";

import { useEffect, useState, useRef } from "react";
import { NumericFormat } from "react-number-format";
import { PiArrowUUpLeft } from "react-icons/pi";
import Image from "next/image";

function OrderMenu({ menu, onCloseSelectedProduct }) {
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const placeholderImage = "@/public/icons/placeholder-image.png";

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
        <div className="relative">
          <Image
            height="0"
            width="180"
            className="h-36 w-full rounded-t-2xl object-cover"
            src={menu.image || placeholderImage}
            alt={menu.image ? menu.name : "Placeholder image"}
          />
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
          <div className="mt-2">
            <ul className="flex flex-wrap items-center">
              {menu.variants.map((items) => (
                <Variants
                  items={items}
                  key={items.version}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                />
              ))}
            </ul>
          </div>
          {menu.addons.length > 0 ? (
            <div className="mt-1 text-qraccent">
              <p className="text-sm font-semibold">Addons</p>
              <ul className="space-y-1">
                {menu.addons?.map((items) => (
                  <AddOns
                    items={items}
                    key={items.name}
                    selectedAddons={selectedAddons}
                    setSelectedAddons={setSelectedAddons}
                  />
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}
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
            <p className="text-xs">Total Harga:</p>
            <p className="text-md font-semibold">
              <NumericFormat
                displayType="text"
                value={menu.variants[0].price}
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

function Variants({ items, selectedVariant, setSelectedVariant }) {
  const selectedStyle = " bg-qraccent text-bcsecondary";

  const isSelected = selectedVariant === items;

  function handleSelectVariant(variant) {
    setSelectedVariant((selectedItem) =>
      selectedItem === variant ? null : variant
    );
  }

  return (
    <li className="mb-2 mr-2">
      <button
        type="button"
        value={selectedVariant}
        onClick={() => handleSelectVariant(items)}
        className={`rounded-sm ${
          selectedVariant === items ? selectedStyle : "text-qraccent "
        } border border-qraccent px-2 py-1 text-xs transition-colors duration-300`}
      >
        {items.version}
      </button>
    </li>
  );
}

function AddOns({ items, selectedAddons, setSelectedAddons }) {
  const selectedStyle = " bg-qraccent text-bcsecondary";

  const isSelected = selectedAddons === items;

  function handleSelectAddons(addon) {
    setSelectedAddons((selectedItem) =>
      selectedItem === addon ? null : addon
    );
  }

  return (
    <li>
      <button
        type="button"
        value={selectedAddons}
        onClick={() => handleSelectAddons(items)}
        className={`${
          isSelected ? selectedStyle : "text-qraccent "
        } rounded-xs flex w-full items-center justify-between border border-qraccent px-2 transition-colors duration-300`}
      >
        <p className="text-xs">{items.name}</p>
        <p>{isSelected ? "-" : "+"}</p>
      </button>
    </li>
  );
}

export default OrderMenu;
