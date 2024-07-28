"use client";

import { useState } from "react";
import Header from "../_components/_dine_in/Header";
import OrderOverview from "../_components/_dine_in/OrderOverview";
import MainMenu from "../_components/_dine_in/MainMenu";
import OrderMenu from "../_components/_dine_in/OrderMenu";
import { useCartDineIn } from "../_stores/store";

function Page() {
  const { cart, setCart } = useCartDineIn();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const totalPrice = handleCalculatePrice();
  console.log(cart);

  function handleSelectProduct(product) {
    setSelectedProduct((menu) => (menu === product ? null : product));
  }

  function handleCloseSelectedProduct() {
    setSelectedProduct(null);
  }

  function handleSubmitProduct(item) {
    setCart(item);
    setSelectedProduct(null);
  }

  function handleCalculatePrice() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  return (
    <>
      {selectedProduct && (
        <div>
          <OrderMenu
            menu={selectedProduct}
            onCloseSelectedProduct={handleCloseSelectedProduct}
            onSubmitProduct={handleSubmitProduct}
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
