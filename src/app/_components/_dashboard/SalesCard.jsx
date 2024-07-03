function SalesCard({ salesSummary }) {
  return (
    <div className="text-dpaccent flex flex-col space-y-5">
      <h1 className="font-semibold text-lg">Rekapan Penjualan</h1>
      <ul
        className={`w-full flex flex-wrap items-center ${
          salesSummary.length < 3
            ? salesSummary.length < 2
              ? "sm:justify-start"
              : "sm:justify-evenly"
            : "sm:justify-between"
        } justify-evenly gap-8`}
      >
        {salesSummary.map((sales, i) => (
          <Card sales={sales} key={i} />
        ))}
      </ul>
    </div>
  );
}

export function Card({ sales }) {
  return (
    <li className="bg-gradient-to-br from-dpprimary/10 backdrop-blur-[1px] border border-dpprimary/10 xl:w-72 lg:w-[247px] md:w-72 w-60 h-32 rounded-xl">
      <div className="px-10 py-7 flex flex-col justify-between h-full tracking-wide">
        <h2 className="font-light md:text-base text-sm">{sales.title}</h2>
        <p className="font-bold xl:text-2xl lg:text-xl md:text-2xl text-[23px] truncate">
          {sales.type === "price" ? "Rp." : ""}
          {sales.desc}
        </p>
      </div>
    </li>
  );
}

export default SalesCard;
