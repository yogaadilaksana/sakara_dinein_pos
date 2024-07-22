"use client";

import { useState } from "react";
import EmptyList from "../../_components/_dine_in/EmptyList";
import { NumericFormat } from "react-number-format";
import Link from "next/link";
import { PiArrowUUpLeft } from "react-icons/pi";

const formatDate = (date) =>
  new Intl.DateTimeFormat("id", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function Page() {
  const [orderReceipt, setOrderReceipt] = useState([
    // {
    //   orderId: "#4ck134bi",
    //   date: "2022-06-10",
    //   time: "16:30",
    //   totalPrice: 100000,
    //   items: [
    //     {
    //       cartId: 1,
    //       name: "Pedawa",
    //       variants: [{ version: "Iced", price: 20000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 20000,
    //     },
    //     {
    //       cartId: 2,
    //       name: "Taro",
    //       variants: [{ version: "Hot", price: 20000 }],
    //       addons: [
    //         {
    //           name: "Cheese Cream",
    //           price: 3000,
    //         },
    //         {
    //           name: "Extra Shots",
    //           price: 3000,
    //         },
    //       ],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 26000,
    //     },
    //     {
    //       cartId: 3,
    //       name: "Roti Bakar",
    //       variants: [{ version: "Coco Crunchy coco", price: 15000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 2,
    //       sumPrice: 15000,
    //     },
    //     {
    //       cartId: 4,
    //       name: "Pedawa",
    //       variants: [{ version: "Iced", price: 20000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 20000,
    //     },
    //     {
    //       cartId: 5,
    //       name: "Taro",
    //       variants: [{ version: "Hot", price: 20000 }],
    //       addons: [
    //         {
    //           name: "Cheese Cream",
    //           price: 3000,
    //         },
    //         {
    //           name: "Extra Shots",
    //           price: 3000,
    //         },
    //       ],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 26000,
    //     },
    //     {
    //       cartId: 6,
    //       name: "Roti Bakar",
    //       variants: [{ version: "Coco Crunchy coco", price: 15000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 2,
    //       sumPrice: 15000,
    //     },
    //   ],
    // },
    // {
    //   orderId: "#4ck134ba",
    //   date: "2022-06-10",
    //   time: "13:30",
    //   totalPrice: 50000,
    //   items: [
    //     {
    //       cartId: 4,
    //       name: "Pedawa",
    //       variants: [{ version: "Iced", price: 20000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 20000,
    //     },
    //     {
    //       cartId: 5,
    //       name: "Taro",
    //       variants: [{ version: "Hot", price: 20000 }],
    //       addons: [
    //         {
    //           name: "Cheese Cream",
    //           price: 3000,
    //         },
    //         {
    //           name: "Extra Shots",
    //           price: 3000,
    //         },
    //       ],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 26000,
    //     },
    //     {
    //       cartId: 6,
    //       name: "Roti Bakar",
    //       variants: [{ version: "Coco Crunchy coco", price: 15000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 2,
    //       sumPrice: 15000,
    //     },
    //   ],
    // },
    // {
    //   orderId: "#4ck134bc",
    //   date: "2022-06-15",
    //   time: "15:30",
    //   totalPrice: 44000,
    //   items: [
    //     {
    //       cartId: 1,
    //       name: "Pedawa",
    //       variants: [{ version: "Iced", price: 20000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 20000,
    //     },
    //     {
    //       cartId: 2,
    //       name: "Taro",
    //       variants: [{ version: "Hot", price: 20000 }],
    //       addons: [
    //         {
    //           name: "Cheese Cream",
    //           price: 3000,
    //         },
    //         {
    //           name: "Extra Shots",
    //           price: 3000,
    //         },
    //       ],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 26000,
    //     },
    //     {
    //       cartId: 3,
    //       name: "Roti Bakar",
    //       variants: [{ version: "Coco Crunchy coco", price: 15000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 2,
    //       sumPrice: 15000,
    //     },
    //   ],
    // },
    // {
    //   orderId: "#4ck134bd",
    //   date: "2022-06-16",
    //   time: "17:30",
    //   totalPrice: 34000,
    //   items: [
    //     {
    //       cartId: 4,
    //       name: "Pedawa",
    //       variants: [{ version: "Iced", price: 20000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 20000,
    //     },
    //     {
    //       cartId: 5,
    //       name: "Taro",
    //       variants: [{ version: "Hot", price: 20000 }],
    //       addons: [
    //         {
    //           name: "Cheese Cream",
    //           price: 3000,
    //         },
    //         {
    //           name: "Extra Shots",
    //           price: 3000,
    //         },
    //       ],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 26000,
    //     },
    //     {
    //       cartId: 6,
    //       name: "Roti Bakar",
    //       variants: [{ version: "Coco Crunchy coco", price: 15000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 2,
    //       sumPrice: 15000,
    //     },
    //   ],
    // },
    // {
    //   orderId: "#4ck134be",
    //   date: "2022-06-16",
    //   time: "15:30",
    //   totalPrice: 15000,
    //   items: [
    //     {
    //       cartId: 1,
    //       name: "Pedawa",
    //       variants: [{ version: "Iced", price: 20000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 20000,
    //     },
    //     {
    //       cartId: 2,
    //       name: "Taro",
    //       variants: [{ version: "Hot", price: 20000 }],
    //       addons: [
    //         {
    //           name: "Cheese Cream",
    //           price: 3000,
    //         },
    //         {
    //           name: "Extra Shots",
    //           price: 3000,
    //         },
    //       ],
    //       description: "",
    //       quantity: 1,
    //       sumPrice: 26000,
    //     },
    //     {
    //       cartId: 3,
    //       name: "Roti Bakar",
    //       variants: [{ version: "Coco Crunchy coco", price: 15000 }],
    //       addons: [],
    //       description: "",
    //       quantity: 2,
    //       sumPrice: 15000,
    //     },
    //   ],
    // },
  ]);

  const orderDateUnique = new Set(
    orderReceipt.map((eachDate) => JSON.stringify({ date: eachDate.date }))
  );

  const orderDate = [...orderDateUnique].map((each) => JSON.parse(each));

  return (
    <div className="grid grid-rows-[auto_1fr_auto] overflow-y-auto overflow-x-hidden">
      <div className="fixed flex w-full items-center space-x-6 border-b border-qraccent/20 bg-bcprimary px-6 pb-6 pt-8">
        <Link href="/dine_in">
          <PiArrowUUpLeft
            size="1.5rem"
            className="text-qrprimary hover:drop-shadow-lg hover:size-7 duration-300 transition-all"
          />
        </Link>
        <h1 className="grow text-lg text-qrprimary">Riwayat Pemesanan</h1>
      </div>
      {orderReceipt.length > 0 ? (
        <ul className="mt-32 w-screen px-2">
          {orderDate
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((items) => (
              <>
                <OrderList
                  formatDate={formatDate}
                  orderTime={orderReceipt}
                  orderDate={items}
                  key={items.date}
                />
              </>
            ))}
        </ul>
      ) : (
        <div className="mt-20 mb-56">
          <EmptyList
            title={"Riwayat Pesanan Kosong"}
            description={"Mulai pesanan pertama hari ini!"}
          />
        </div>
      )}
    </div>
  );
}

function OrderList({ orderTime, orderDate, formatDate }) {
  return (
    <li className="mb-5">
      <div className="bg-qrprimary px-7 py-3">
        <h2 className="text-sm font-semibold text-bcprimary">
          {formatDate(orderDate.date)}
        </h2>
      </div>
      <div>
        <div>
          {orderTime
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((items) =>
              items.date === orderDate.date ? (
                <OrderItems items={items} key={items.orderId} />
              ) : (
                ""
              )
            )}
        </div>
      </div>
    </li>
  );
}

function OrderItems({ items }) {
  return (
    <button
      type="button"
      className={`w-full border border-qraccent/10 bg-bcprimary px-7 py-5 text-qraccent transition-colors duration-200 hover:bg-qraccent hover:text-bcprimary`}
    >
      <div className="flex items-center justify-between font-semibold">
        <NumericFormat
          displayType="text"
          value={items.totalPrice}
          prefix={"Rp."}
          thousandSeparator
        />
        <p>{items.time}</p>
      </div>
      <div className="mt-2">
        <ul className="flex flex-wrap">
          {items.items.map((itemsMenu) => (
            <li
              className="mr-2 mb-1 flex space-x-1 whitespace-nowrap text-xs tracking-wider"
              key={itemsMenu.cartId}
            >
              <p>{itemsMenu.quantity}x</p>
              <p>{itemsMenu.name}</p>
              <p>/</p>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}

export default Page;
