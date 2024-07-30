import { useEffect, useState } from "react";
import Category from "../_dine_in/Category";
import MenuList from "../_dine_in/MenuList";
import EmptyList from "../_dine_in/EmptyList";

function MainMenu({ onSelectProduct }) {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState([]);
  const [catSelected, setCatSelected] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategory(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProducts();
  }, [catSelected]);

  function handleSelectedCat(selection) {
    setCatSelected((cat) =>
      selection === 0 ? 0 : cat.id === selection ? "" : selection
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-screen custom-scrollbar-x to-transparent xs:top-24 z-8 sticky top-20 overflow-x-auto bg-gradient-to-b from-bcprimary via-bcprimary backdrop-blur-sm border-b border-bcprimary/20">
        <Category
          category={category}
          catSelected={catSelected}
          onSelectedCat={handleSelectedCat}
        />
      </div>
      {menu.length > 0 ? (
        <div className="overflow-y-auto mt-10 w-screen flex flex-col">
          {catSelected ? (
            <ul className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menu
                .filter((items) => items.category_id === catSelected)
                .map((items) => (
                  <MenuList
                    menu={items}
                    key={items.id}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
            </ul>
          ) : (
            <ul className="container grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
              {menu.map((items) => (
                <MenuList
                  menu={items}
                  key={items.id}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="px-12">
          <EmptyList
            title={"Menu Kosong"}
            description={"Tambah menu yang akan dijual!"}
          />
        </div>
      )}
    </div>
  );
}

export default MainMenu;
