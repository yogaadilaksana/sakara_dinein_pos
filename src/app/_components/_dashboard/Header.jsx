"use client";
import { useState } from "react";
import DropDownUser from "./DropDownUser";
import Logo from "./Logo";
import User from "./User";
import MobileBurgerButton from "./MobileBurgerButton";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isOverTabletView = window.matchMedia(`(max-width: 1023px)`).matches;
  return (
    <header>
      <div className="fixed z-20 w-full flex items-center justify-between md:px-24 px-10 py-4 bg-bcsecondary border border-b border-dpprimary/15">
        {isOverTabletView && <MobileBurgerButton />}
        <Logo />
        <div className="relative">
          <User isOpen={isOpen} setIsOpen={setIsOpen} />
          {isOpen && <DropDownUser />}
        </div>
      </div>
    </header>
  );
}

export default Header;
