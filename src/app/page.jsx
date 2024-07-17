import Product from "@/components/Product";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="font-bold text-3xl text-red-500">
        <ul className="flex justify-center items-center pt-7">
          <li><Link href={`/menu`}>Menu</Link></li>
        </ul>
        <Product />
      </h2>
    </div>
  );
}
