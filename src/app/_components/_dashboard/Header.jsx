"use client";
import { useEffect, useRef } from "react";
import DropDownUser from "./DropDownUser";
import Logo from "./Logo";
import User from "./User";
import MobileBurgerButton from "./MobileBurgerButton";
import useToggleUiStore from "@/app/_stores/store";

function Header() {
  const { isUserOpen, setIsUserOpen, setIsSideBarOpen, setCloseUser } =
    useToggleUiStore();
  // const isOverTabletView = window.matchMedia(`(max-width: 1023px)`).matches;

  const userRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setCloseUser();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setCloseUser]);

  return (
    <header>
      <div className="fixed z-20 w-full h-12 flex items-center justify-between md:px-24 px-10 py-4border border-b border-dpprimary/15 bg-bcaccent/30 backdrop-blur-sm">
        <MobileBurgerButton setIsOpen={setIsSideBarOpen} />
        <Logo />
        <div className="relative">
          <User isOpen={isUserOpen} setIsOpen={setIsUserOpen} />
          {isUserOpen && <DropDownUser userRef={userRef} />}
        </div>
      </div>
    </header>
  );
}

export default Header;
