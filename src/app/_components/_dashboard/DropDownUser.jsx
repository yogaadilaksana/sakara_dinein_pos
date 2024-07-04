import Link from "next/link";

function DropDownUser({ userRef }) {
  return (
    <div
      ref={userRef}
      className="absolute bg-bcaccent/40 px-8 py-6 md:-left-12 -left-16 top-9 rounded-xl border border-dpaccent/15 flex flex-wrap justify-center divide-y divide-dpaccent/10 space-y-4 shadow-lg shadow-dpaccent/5 text-dpaccent text-sm tracking-wide"
    >
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
