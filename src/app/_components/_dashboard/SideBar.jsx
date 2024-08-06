"use client";
import useToggleUiStore from "@/app/_stores/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiLayout, FiArchive, FiFileText, FiServer } from "react-icons/fi";

function SideBar() {
  const [arrowColor, setArrowColor] = useState("#2D3250");
  const [isOpenDashboard, setIsOpenDashboard] = useState(false);
  const [isOpenReport, setIsOpenReport] = useState(false);
  const { isSideBarOpen, setCloseSideBar } = useToggleUiStore();
  const pathname = usePathname();

  const sideBarRef = useRef();

  useEffect(() => {
    setCloseSideBar();
  }, [pathname]);

  // if (!isSideBarOpen) return null;

  return (
    <div
      ref={sideBarRef}
      className={`${
        isSideBarOpen ? "visible" : "collapse"
      } lg:fixed lg:visible z-10 fixed h-screen from-bcaccent bg-gradient-to-br via-bcaccent backdrop-blur-sm border border-r border-dpprimary/15 min-w-80 pt-28 pl-20 space-y-7 flex flex-col justify-start items-start tracking-wide text-dpaccent`}
    >
      {/* Dashboard */}
      <div>
        <button
          type="button"
          onMouseOver={() => setArrowColor("#7077A1")}
          onMouseOut={() => setArrowColor("#2D3250")}
          onClick={() => setIsOpenDashboard(!isOpenDashboard)}
          className={`${
            pathname === "/dashboard"
              ? "font-semibold text-dpprimary translate-x-2"
              : "hover:translate-x-1"
          } flex items-center gap-3 text-dpaccent hover:text-dpprimary transition-all duration-300`}
        >
          <FiLayout />
          <span>Dashboard</span>
          {isOpenDashboard ? (
            <FaChevronUp fontSize="0.8em" />
          ) : (
            <FaChevronDown fontSize="0.8em" />
          )}
        </button>
        {isOpenDashboard && (
          // {/* Children */}
          <div className="text-sm flex flex-col space-y-2 mt-2 ml-[29px]">
            {/* Dashboard Beranda */}
            <Link
              href="/dashboard"
              className={`${
                pathname === "/dashboard"
                  ? "font-semibold text-dpprimary translate-x-2"
                  : "hover:translate-x-1"
              } hover:text-dpprimary transition-all duration-300`}
            >
              Beranda
            </Link>
            {/* Dashboard Grafik */}
            <Link
            href="/dashboard/charts"
            className="hover:text-dpprimary transition-all hover:translate-x-1 duration-300"
            >
            Grafik Penjualan
            </Link>
          </div>
        )}
      </div>

      {/* Persediaan */}
      <Link
        href="/dashboard/persediaan"
        className={`${
          pathname === "/dashboard/persediaan"
            ? "font-semibold text-dpprimary translate-x-2"
            : "hover:translate-x-1"
        } flex items-center gap-3 hover:text-dpprimary transition-all duration-300`}
      >
        <FiArchive />
        Persediaan
      </Link>

      {/* Laporan */}
      <div>
        <button
          type="button"
          onMouseOver={() => setArrowColor("#7077A1")}
          onMouseOut={() => setArrowColor("#2D3250")}
          onClick={() => setIsOpenReport(!isOpenReport)}
          className={`${
            pathname === "/dashboard/transaksi" ||
            pathname === "/dashboard/shift"
              ? "font-semibold text-dpprimary translate-x-2"
              : "hover:translate-x-1"
          } flex items-center gap-3 text-dpaccent hover:text-dpprimary transition-all duration-300`}
        >
          <FiFileText className={`fill-[${arrowColor}]`} />
          <span>Laporan</span>
          {isOpenReport ? (
            <FaChevronUp fontSize="0.8em" className={`fill-[${arrowColor}]`} />
          ) : (
            <FaChevronDown
              fontSize="0.8em"
              className={`fill-[${arrowColor}]`}
            />
          )}
        </button>
        {isOpenReport && (
          // {/* Children */}
          <div className="text-sm flex flex-col space-y-2 mt-2 ml-[28px]">
            {/* Transaksi */}
            <Link
              href="/dashboard/transaksi"
              className={`${
                pathname === "/dashboard/transaksi"
                  ? "font-semibold text-dpprimary translate-x-2"
                  : "hover:translate-x-1"
              } hover:text-dpprimary transition-all duration-300`}
            >
              Transaksi
            </Link>
            {/* Shift */}
            <Link
              href="/dashboard/shift"
              className={`${
                pathname === "/dashboard/shift"
                  ? "font-semibold text-dpprimary translate-x-2"
                  : "hover:translate-x-1"
              } hover:text-dpprimary transition-all duration-300`}
            >
              Shift Kerja
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
