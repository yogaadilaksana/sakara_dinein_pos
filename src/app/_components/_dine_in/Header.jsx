import Link from "next/link";
import { useState } from "react";
import { RiFileList3Line } from "react-icons/ri";

function Header() {
  const [orderAmount, setOrderAmount] = useState(2);
  return (
    <div className="container max-w-full px-10 md:px-20 grid grid-cols-2 bg-bcprimary pb-6 pt-7">
      <h1 className="font-xl flex items-center text-xl text-qrprimary">
        Hallo User!
      </h1>
      <div className="items flex justify-self-end relative">
        <Link className="size-1/4" href="/dine_in/struk">
          {orderAmount > 0 && (
            <div className="absolute pl-3 -mt-[2px]">
              <p className="flex w-4 items-center justify-center rounded-full bg-warn text-xs">
                {orderAmount}
              </p>
            </div>
          )}
          <RiFileList3Line size="2rem" className="text-qrprimary" />
        </Link>
      </div>
    </div>
  );
}

export default Header;