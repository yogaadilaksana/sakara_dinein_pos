"use client";

import { useState } from "react";
import EmptyList from "../../_components/_dine_in/EmptyList";
import { PiArrowUUpLeft } from "react-icons/pi";
import Link from "next/link";
import { NumericFormat } from "react-number-format";

const data = [
  //   {
  //     cartId: 1,
  //     name: "Pedawa",
  //     variants: [{ version: "Iced", price: 20000 }],
  //     addons: [],
  //     description: "",
  //     quantity: 1,
  //     sumPrice: 20000,
  //   },
  //   {
  //     cartId: 2,
  //     name: "Taro",
  //     variants: [{ version: "Hot", price: 20000 }],
  //     addons: [
  //       {
  //         name: "Cheese Cream",
  //         price: 3000,
  //       },
  //       {
  //         name: "Extra Shots",
  //         price: 3000,
  //       },
  //     ],
  //     description: "",
  //     quantity: 1,
  //     sumPrice: 26000,
  //   },
  //   {
  //     cartId: 3,
  //     name: "Roti Bakar",
  //     variants: [{ version: "Coco Crunchy coco", price: 15000 }],
  //     addons: [],
  //     description: "",
  //     quantity: 2,
  //     sumPrice: 15000,
  //   },
];

function Page() {
  const [menu, setMenu] = useState(data);
  console.log(menu);

  function handleAddQty(id) {
    setMenu((prevItems) =>
      prevItems.map((menu) =>
        menu.cartId === id ? { ...menu, quantity: menu.quantity + 1 } : menu
      )
    );
  }

  function handleSubtractQty(id) {
    setMenu((prevItems) =>
      prevItems
        .map((menu) =>
          menu.cartId === id ? { ...menu, quantity: menu.quantity - 1 } : menu
        )
        .filter((menu) => menu.quantity > 0)
    );
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] overflow-y-auto overflow-x-hidden">
      <div className="fixed flex w-full items-center space-x-6 border-b border-qraccent/20 bg-bcprimary px-6 pb-6 pt-8">
        <Link href="/dine_in">
          <PiArrowUUpLeft
            size="1.5rem"
            className="text-qrprimary hover:drop-shadow-lg hover:size-7 duration-300 transition-all"
          />
        </Link>
        <h1 className="grow text-lg text-qrprimary">Keranjang Belanja</h1>
      </div>
      {menu.length > 0 ? (
        <div>
          <div className="mb-40 mt-28 px-2">
            <ul>
              {menu.map((items) => (
                <CartItem
                  menu={items}
                  key={items.cartId}
                  onAddQty={handleAddQty}
                  onSubtractQty={handleSubtractQty}
                />
              ))}
            </ul>
          </div>
          <div className="fixed bottom-0 mt-4 w-full border-t border-qraccent/20 bg-bcsecondary px-6 py-6">
            <TotalPriceCard />
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

function CartItem({ menu, onAddQty, onSubtractQty }) {
  return (
    <li className="my-1 grid grid-cols-[auto_auto] items-center space-x-4 border border-qraccent/20 bg-bcsecondary px-8 py-6">
      <div className="min-w-64">
        <div className="flex w-full items-start">
          <p className="text-md max-w-24 font-semibold text-qrprimary">
            {menu.name}
          </p>
          <p className="mx-1 line-clamp-1 text-qrprimary">
            / {menu.variants[0].version}
          </p>
        </div>

        <ul className="mt-2">
          <p className="text-sm font-semibold text-qraccent">Addons:</p>
          {menu.addons.length > 0 ? (
            menu.addons?.map((items) => (
              <li className="text-xs font-light text-qraccent" key={items.name}>
                {items.name}
              </li>
            ))
          ) : (
            <p className="text-sm font-light text-qraccent">tidak ada</p>
          )}
        </ul>
        <div className="mt-2">
          <p className="font-semibold text-qrprimary">
            <NumericFormat
              displayType="text"
              value={menu.sumPrice}
              prefix={"Rp."}
              thousandSeparator
            />
          </p>
        </div>
        {/* <div className="mt-2">
          <button
            type="button"
            className="flex items-center space-x-1 rounded-lg bg-bc px-2 py-1 text-xs font-thin text-accent"
          >
            <img
              src="../public/icons/icon-ubah-keranjang.png"
              alt=""
              className="w-3"
            />
            <p>Ubah</p>
          </button>
        </div> */}
      </div>

      <div className="flex flex-col items-center space-y-3">
        <button
          type="button"
          className="border border-qraccent px-1 text-sm text-qraccent focus:bg-qraccent focus:text-bcprimary"
          onClick={() => onAddQty(menu.cartId)}
        >
          +
        </button>
        <p className="my-2 font-semibold">{menu.quantity}</p>
        <button
          type="button"
          className="border border-qraccent px-1 text-sm text-qraccent focus:bg-qraccent focus:text-bcprimary"
          onClick={() => onSubtractQty(menu.cartId)}
        >
          -
        </button>
      </div>
    </li>
  );
}

function TotalPriceCard() {
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <h1 className="font-semibold">Total Harga</h1>
        <p className="text-lg">
          <NumericFormat
            displayType="text"
            value={1000}
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
