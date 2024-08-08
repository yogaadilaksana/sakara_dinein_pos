export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4">
      <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-8">
        Selamat Datang Di Sakara Coffe Bali
      </h2>
      <div className="space-y-4">
        <a href="/dashboard">
          <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition">
            Admin
          </button>
        </a>
        <a href="/pos">
          <button className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition">
            Cashier
          </button>
        </a>
      </div>
    </div>
  );
}
