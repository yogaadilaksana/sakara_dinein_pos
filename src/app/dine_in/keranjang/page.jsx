"use client";

import { useState } from "react";
import EmptyList from "../../_components/_dine_in/EmptyList";
import { PiArrowUUpLeft } from "react-icons/pi";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import { useCartDineIn } from "@/app/_stores/store";

function Page() {
  const { cart, handleAddQty, handleSubtractQty } = useCartDineIn();
  const totalPriceToPay = handleTotalPrice();

  function handleTotalPrice() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] overflow-y-auto overflow-x-hidden min-h-screen">
      <div className="fixed flex w-full items-center space-x-6 border-b border-qraccent/20 bg-bcprimary px-6 pb-6 pt-8">
        <Link href="/dine_in">
          <PiArrowUUpLeft
            size="1.5rem"
            className="text-qrprimary hover:drop-shadow-lg hover:size-7 duration-300 transition-all"
          />
        </Link>
        <h1 className="grow text-lg text-qrprimary">Keranjang Belanja</h1>
      </div>
      {cart.length > 0 ? (
        <div>
          <div className="mb-40 mt-28 px-2">
            <ul>
              {cart.map((items, i) => (
                <CartItem
                  product={items}
                  key={i}
                  onAddQty={handleAddQty}
                  onSubtractQty={handleSubtractQty}
                />
              ))}
            </ul>
          </div>
          <div className="fixed bottom-0 w-full border-t border-qraccent/20 bg-bcsecondary px-6 py-6">
            <TotalPriceCard totalPriceToPay={totalPriceToPay} />
          </div>
        </div>
      ) : (
        <div className="mt-20 mb-56">
          <EmptyList
            title={"Belum Ada Pesanan"}
            description={"Mulai pesan menu favoritmu!"}
          />
        </div>
      )}
    </div>
  );
}

function CartItem({ product, onAddQty, onSubtractQty }) {
  return (
    <li className="space-x-4 border border-qraccent/20 bg-bcsecondary px-8 py-6 mb-2">
      <div>
        <div className="flex w-full items-start">
          <p className="truncate text-md font-semibold text-qrprimary">
            {product.name}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-semibold text-qrprimary text-lg">
            <NumericFormat
              displayType="text"
              value={product.price * product.quantity}
              prefix={"Rp."}
              thousandSeparator
            />
          </p>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="border border-qraccent px-2 text-xs text-qraccent focus:bg-qraccent focus:text-bcprimary"
              onClick={() => onSubtractQty(product.id)}
            >
              -
            </button>
            <p className="my-2 font-semibold">{product.quantity}</p>
            <button
              type="button"
              className="border border-qraccent px-2 text-xs text-qraccent focus:bg-qraccent focus:text-bcprimary"
              onClick={() => onAddQty(product.id)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function TotalPriceCard({ totalPriceToPay }) {
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <h1 className="text-md">Total Harga</h1>
        <p className="text-xl font-semibold">
          <NumericFormat
            displayType="text"
            value={totalPriceToPay}
            prefix={"Rp."}
            thousandSeparator
          />
        </p>
      </div>
      <button className="mt-4 flex w-full justify-center rounded-xl bg-qraccent px-6 py-2 text-bcprimary transition-colors duration-300 focus:bg-qrprimary">
        Pembayaran
      </button>
    </>
  );
}

export default Page;
