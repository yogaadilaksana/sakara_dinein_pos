import Image from "next/image";
import { NumericFormat } from "react-number-format";

function MenuList({ menu, onSelectProduct }) {
  const placeholderImage = "@/public/dine_in/placeholder-image.png";
  return (
    <li className="">
      <div className="w-auto pt-4" onClick={() => onSelectProduct(menu)}>
        <div className="mb-3">
          <Image
            src={menu.image || placeholderImage}
            alt={menu.image ? menu.name : "Placeholder image"}
            width="130"
            height="70"
            className="border-2 border-qrprimary/10 hover:shadow-lg hover:-translate-y-1 duration-300 transition-all rounded-sm"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-regular text-sm tracking-wide text-qraccent">
            {menu.name}
          </p>
          <p className="text-lg font-bold text-qrprimary">
            <NumericFormat
              displayType="text"
              value={menu.variants[0].price}
              prefix={"Rp."}
              thousandSeparator
            />
          </p>
        </div>
      </div>
    </li>
  );
}

export default MenuList;
