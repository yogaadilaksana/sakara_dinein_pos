import { TbMoodEmpty } from "react-icons/tb";

function EmptyTable({ children }) {
  return (
    <div className="pt-10">
      <div className="flex flex-col justify-center items-center">
        <TbMoodEmpty size="5rem" className="text-dpprimary/20" />
        <div className="mt-2 flex flex-col items-center">
          <p className="text-dpprimary/40">Data Kosong</p>
          <p className="text-dpprimary/40">Mulai Berjualan!</p>
        </div>
      </div>
    </div>
  );
}

export default EmptyTable;
