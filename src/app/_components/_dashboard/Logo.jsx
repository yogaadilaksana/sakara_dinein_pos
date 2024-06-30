import Link from "next/link";

function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex justify-center min-w-24 sm:text-base text-xs font-semibold text-dpaccent uppercase"
    >
      Sakara Kopi Bali
    </Link>
  );
}

export default Logo;
