import Link from "next/link";
import { PiShoppingBagOpen } from "react-icons/pi";
import { NumericFormat } from "react-number-format";

function OrderOverview({ cart, totalPrice }) {
  const totalProductInCart = handleTotalProduct();

  function handleTotalProduct() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <Link href="/dine_in/keranjang">
      <div className="flex h-full items-center justify-between border-t border-t-bcaccent/20 bg-gradient-to-t from-bcprimary via-bcprimary to-transparent backdrop-blur-sm px-9 py-6">
        <div className="-space-y-1">
          <p className="text-xs font-light tracking-wider text-qrprimary">
            Keranjang
          </p>
          {cart.length ? (
            <p className="text-lg font-semibold tracking-wider text-qrprimary">
              {totalProductInCart} produk
            </p>
          ) : (
            <p className="text-lg font-semibold tracking-wider text-qrprimary">
              Pilih Menumu!
            </p>
          )}
        </div>
        <div className="flex flex-row items-center gap-5">
          <p className="text-xl font-semibold text-qrprimary">
            <NumericFormat
              displayType="text"
              value={totalPrice}
              prefix={"Rp."}
              thousandSeparator
            />
          </p>
          <PiShoppingBagOpen size="1.8rem" className="text-qrprimary" />
        </div>
      </div>
    </Link>
  );
}

export default OrderOverview;