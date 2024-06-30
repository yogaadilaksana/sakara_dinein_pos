"use client";
import Image from "next/image";
import UserIcon from "@/../../public/dashboard/user.png";
import { FiList, FiX } from "react-icons/fi";

function User({ isOpen, setIsOpen }) {
  return (
    <div>
      <button
        className="flex justify-between items-center w-[55px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={UserIcon}
          width="25"
          height="25"
          alt="User Profile Picture"
          type="button"
        />
        <span>
          {isOpen ? (
            <FiX color="#2D3250" className="w-[20px] h-[20px]" />
          ) : (
            <FiList color="#2D3250" className="w-[20px] h-[20px]" />
          )}
        </span>
      </button>
    </div>
  );
}

export default User;
