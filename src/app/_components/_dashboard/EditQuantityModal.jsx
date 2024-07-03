import { FiX } from "react-icons/fi";
import { FaSquarePlus, FaSquareMinus } from "react-icons/fa6";

function EditQuantityModal() {
  // const handleCloseModal = () => {};

  return (
    <div className="z-50 absolute inset-0 flex items-center justify-center -mt-[100px] text-dpaccent">
      <form className="bg-bcsecondary md:w-[500px] w-[360px] rounded-lg">
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <button type="button">
            <FiX className="text-error/60 hover:text-error transition-colors duration-300" />
          </button>
          <h3 className="text-xs text-dpaccent/40">Ubah Jumlah</h3>
          <button
            type="button"
            className="float-end px-3 py-1 rounded-md bg-dpprimary hover:bg-dpaccent transition-colors duration-300 text-bcprimary text-xs"
            onSubmit={""}
          >
            Simpan
          </button>
        </div>
        <div className="flex justify-between items-center px-10 py-4">
          <p>Nama Produk</p>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              className="text-dpaccent hover:text-dpprimary transition-colors duration-300"
            >
              <FaSquareMinus size="1rem" />
            </button>
            {/* Stok sekarang */}
            <input
              type="number"
              // value={0}
              placeholder={0}
              className="w-7 text-center bg-bcsecondary"
            />
            <div className="text-dpaccent hover:text-dpprimary transition-colors duration-300">
              <FaSquarePlus size="1rem" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditQuantityModal;
