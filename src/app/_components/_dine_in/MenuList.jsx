import Image from "next/image";
import { NumericFormat } from "react-number-format";

function MenuList({ menu, onSelectProduct }) {
  const placeholderImage = "/dine_in/placeholder-image.png";
  return (
    <li>
      <div
        className="items-center flex flex-col"
        onClick={() => onSelectProduct(menu)}
      >
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
          <p className="w-32 truncate font-regular text-sm tracking-wide text-qraccent">
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
