import Link from "next/link";

function DropDownUser() {
  return (
    <div className="absolute bg-gradient-to-br from-dpprimary/10 backdrop-blur-[1px] px-8 py-6 md:-left-12 -left-16 top-9 rounded border border-dpprimary/10 flex flex-wrap justify-center divide-y divide-dpaccent/10 space-y-4 shadow-lg shadow-dpaccent/5 text-dpaccent text-sm tracking-wide">
      <Link
        href=""
        className=" hover:text-dpprimary transition-colors duration-300"
      >
        Toko
      </Link>
      <Link
        href=""
        className="pt-4 w-full flex justify-center hover:text-dpprimary transition-colors duration-300"
      >
        Pengaturan
      </Link>
      <Link
        href=""
        className="pt-4 w-full flex justify-center hover:text-dpprimary transition-colors duration-300"
      >
        Keluar
      </Link>
    </div>
  );
}

export default DropDownUser;
