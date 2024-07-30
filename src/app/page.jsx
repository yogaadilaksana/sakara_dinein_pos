import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-y-14">
      <div className="container max-w-full flex flex-col items-center justify-center gap-y-5">
        <h1 className="font-black text-8xl">SAKARA KOPI BALI</h1>
        <p className="text-pretty max-w-3xl text-sm text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, tempore
          eveniet. Nulla, reprehenderit necessitatibus porro sed quaerat non.
          Magni numquam labore quos deleniti fugiat, ad ea officia officiis
          tempore quod.
        </p>
      </div>
      <div className="flex gap-x-9 items-center">
        <Link href="/auth/login">
          <button className="bg-neutral-900 text-bcprimary px-5 py-3 hover:ring-2 ring-offset-4 ring-neutral-900 transition duration-300">
            Masuk Sebagai Adminaaa
          </button>
        </Link>
        <span className="text-xl">/</span>
        <Link href="/dine_in">
          <button className="bg-neutral-900 text-bcprimary px-5 py-3 hover:ring-2 ring-offset-4 ring-neutral-900 transition duration-300">
            Daftar Sebagai Tamu
          </button>
        </Link>
      </div>
    </div>
  );
}
