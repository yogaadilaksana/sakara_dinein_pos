import { NumericFormat } from "react-number-format";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import useToggleUiStore from "@/app/_stores/store";

const categories = ["Signature", "Coffee", "Tea", "Snack", "Main Course"];

function EditItemForm() {
  const { setCloseSelectedItem, selectedItemData } = useToggleUiStore();
  const [picture, setPicture] = useState([]);
  const [productName, setProductName] = useState(selectedItemData.itemName);
  const [category, setCategory] = useState(selectedItemData.category);
  const [quantity, setQuantity] = useState(selectedItemData.quantity);
  const [price, setPrice] = useState(selectedItemData.price);

  console.log(selectedItemData.img);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setPicture(e.target.files[0]);
    }
  };

  return (
    <div className="w-full px-6">
      <div className="flex divide-dpaccent/15 divide-x">
        <h3 className="font-semibold md:text-lg text-sm text-dpaccent w-max">
          Ubah Produk
        </h3>
        <p className="font-semibold md:text-lg text-sm text-dpaccent w-max">
          {}
        </p>
      </div>
      <form className="flex flex-col gap-y-4">
        <div className="flex xl:justify-between sm:flex-row flex-wrap gap-x-7 gap-y-3 mt-2">
          <div className="w-[230px] space-y-1">
            <Label className="cursor-pointer" htmlFor="picture">
              Gambar
            </Label>
            <Input
              value={picture}
              className="text-xs text-dpaccent cursor-pointer"
              id="picture"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="w-[260px] space-y-1">
            <Label htmlFor="productName">Nama Produk</Label>
            <Input
              value={productName}
              onChange={() => setProductName()}
              className="text-xs text-dpaccent"
              id="productName"
              type="text"
              placeholder="Nama produkmu"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-dpaccent">Kategori</SelectLabel>
                  {categories.map((category, i) => (
                    <SelectItem
                      className="text-dpaccent text-xs"
                      key={i}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[80px] space-y-1">
            <Label htmlFor="qty">Jumlah</Label>
            <Input
              type="number"
              value={quantity}
              placeholder={0}
              onChange={(e) => setQuantity(e.target.value)}
              className="text-center text-xs text-dpaccent"
            />
          </div>
          <div className="w-[160px] space-y-1">
            <Label htmlFor="price">Harga</Label>
            <NumericFormat
              id="price"
              prefix={"Rp."}
              value={price}
              placeholder="Harga produk"
              customInput={Input}
              thousandSeparator
              className="text-xs text-dpaccent"
              onChange={() => setPrice()}
            />
          </div>
        </div>
        <div className="justify-end flex gap-x-2">
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-dpprimary duration-300 transition-colors hover:bg-dpprimary/30 text-sm text-bcaccent"
          >
            Ubah
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-lg bg-error duration-300 transition-colors hover:bg-dpprimary/30 text-sm text-bcaccent"
            onClick={setCloseSelectedItem}
          >
            Tutup
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditItemForm;
