import Link from "next/link";

function DropDownUser() {
  return (
    <div className="absolute w-36 bg-bcaccent/40 px-8 py-6 md:-left-12 -left-16 top-9 rounded-xl border border-dpaccent/15 flex flex-wrap justify-center divide-y divide-dpaccent/10 space-y-4 shadow-lg shadow-dpaccent/5 text-dpaccent text-sm tracking-wide">
      <Link
        href=""
        className="flex justify-center hover:text-dpprimary transition-colors duration-300"
      >
        Toko
      </Link>
      <Link
        href="/dine_in"
        className="pt-4 flex justify-center hover:text-dpprimary transition-colors duration-300"
      >
        Dine-in
      </Link>
      <Link
        href="/auth/login"
        className="pt-4 flex justify-center hover:text-dpprimary transition-colors duration-300"
      >
        Keluar
      </Link>
    </div>
  );
}

export default DropDownUser;
