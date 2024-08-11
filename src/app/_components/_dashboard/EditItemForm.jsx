import { NumericFormat } from "react-number-format";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
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
  const [picture, setPicture] = useState(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [id, setProductID] = useState(null);

  useEffect(() => {
    if (selectedItemData) {
      setProductName(selectedItemData.name || "");
      setCategory(selectedItemData.category_id || "");
      setQuantity(selectedItemData.stock || 0);
      setPrice(selectedItemData.price || 0);
      setPicture(selectedItemData.image || null);
      setProductID(selectedItemData.id || null);
    }
  }, [selectedItemData]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setPicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = {
      name: productName,
      category_id: category,
      stock: quantity,
      price: price,
      image: picture ? picture.name : picture || null, // Use old image if new one is not provided
    };

    console.log("Item data before saving:", itemData);

    const endpoint = `/api/product`;
    const method = "PUT";

    try {
      let imageFilePath = itemData.image; // Initialize with existing image path

      if (picture) {
        const formData = new FormData();
        formData.append('file', picture);

        const fileUploadResponse = await fetch(`/api/file`, {
          method: "POST",
          body: formData,
        });

        if (!fileUploadResponse.ok) throw new Error('File upload failed');

        const fileUploadResult = await fileUploadResponse.json();
        imageFilePath = fileUploadResult.filePath;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...itemData, id: id, image: imageFilePath }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Item updated successfully:", result);
        // Optionally call a function to update state
      } else {
        const errorText = await response.text();
        console.error("Error updating item:", errorText);
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  return (
    <div className="w-full px-6">
      <div className="flex divide-dpaccent/15 divide-x">
        <h3 className="font-semibold md:text-lg text-sm text-dpaccent w-max">
          Ubah Produk
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        {/* Form fields */}
        <div className="flex xl:justify-between sm:flex-row flex-wrap gap-x-7 gap-y-3 mt-2">
          <div className="w-[230px] space-y-1">
            <Label className="cursor-pointer" htmlFor="picture">
              Gambar
            </Label>
            <Input
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
              onChange={(e) => setProductName(e.target.value)}
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
              onValueChange={(values) => setPrice(values.value)}
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
