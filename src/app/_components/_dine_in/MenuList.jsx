import Image from "next/image";
import { NumericFormat } from "react-number-format";

function MenuList({ menu, onSelectProduct }) {
  const placeholderImage = "/dine_in/placeholder-image.png";
  return (
    <li className="">
      <div className="w-auto pt-4" onClick={() => onSelectProduct(menu)}>
        <div className="mb-3">
          <div
            style={{
              position: "relative",
              width: `${130}px`,
              height: `${130}px`,
            }}
          >
            <Image
              src={menu.image || placeholderImage}
              alt={menu.name}
              fill
              style={{ objectFit: "cover" }}
              className="-z-10 border-2 border-qrprimary/10 rounded-sm"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="font-regular text-sm tracking-wide text-qraccent">
            {menu.name}
          </p>
          <p className="text-lg font-bold text-qrprimary">
            <NumericFormat
              displayType="text"
              value={menu.price}
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
