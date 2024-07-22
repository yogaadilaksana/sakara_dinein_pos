"use client";

import { useState } from "react";
import Header from "../_components/_dine_in/Header";
import OrderOverview from "../_components/_dine_in/OrderOverview";
import MainMenu from "../_components/_dine_in/MainMenu";
import OrderMenu from "../_components/_dine_in/OrderMenu";

function Page() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Pedawa",
      type: "coffee",
      image: "../public/images/cookies-eat.jpg",
      description: "Es kopi susu dengan citarasa aren",
      variants: [
        {
          version: "Iced",
          price: 20000,
        },
      ],
      addons: [],
      quantity: 3,
    },
    {
      id: 3,
      name: "Taro",
      type: "milk-based",
      image: "../public/images/stack-cookies.jpg",
      description: "Creamy taro susu",
      variants: [
        {
          version: "Iced",
          price: 22000,
        },
      ],
      addons: [
        {
          name: "Cheese Cream",
          price: 3000,
        },
      ],
      quantity: 1,
    },
    {
      id: 5,
      name: "Roti Bakar",
      type: "snack",
      image: "../public/images/stack-cookies.jpg",
      description: "6 potong roti bakar dengan pilihan rasa",
      variants: [
        {
          version: "Tiramisu",
          price: 15000,
        },
      ],
      addons: [],
      quantity: 2,
    },
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const totalPrice = handleCalculatePrice();

  function handleSelectProduct(product) {
    setSelectedProduct((menu) => (menu === product ? null : product));
  }

  function handleCloseSelectedProduct() {
    setSelectedProduct(null);
  }

  function handleCalculatePrice() {
    return cart.reduce(
      (total, item) => total + item.variants[0].price * item.quantity,
      0
    );
  }
  return (
    <>
      {selectedProduct && (
        <div>
          <OrderMenu
            menu={selectedProduct}
            onCloseSelectedProduct={handleCloseSelectedProduct}
            key={selectedProduct.id}
          />
        </div>
      )}

      <div className="relative mb-32 grid min-h-screen grid-rows-[auto_1fr_auto]">
        {/* Header */}
        <div className="fixed w-full">
          <Header />
        </div>
        {/* Header */}

        {/* Main */}
        <div className="mt-24">
          <MainMenu onSelectProduct={handleSelectProduct} />
        </div>
        {/* Main */}

        {/* Footer */}
        {cart.length > 0 && (
          <div className={`fixed bottom-0 w-full`}>
            <OrderOverview cart={cart} totalPrice={totalPrice} />
          </div>
        )}
        {/* Footer */}
      </div>
    </>
  );
}

export default Page;
