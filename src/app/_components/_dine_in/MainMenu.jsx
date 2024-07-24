import { useEffect, useState } from "react";
import Category from "../_dine_in/Category";
import MenuList from "../_dine_in/MenuList";
import EmptyList from "../_dine_in/EmptyList";

// const products = [
//   {
//     id: 1,
//     name: "Pedawa",
//     type: "coffee",
//     image: "/dine_in/cookies-eat.jpg",
//     description: "Es kopi susu dengan citarasa aren",
//     variants: [
//       {
//         version: "Iced",
//         price: 20000,
//       },
//     ],
//     addons: [],
//   },
//   {
//     id: 2,
//     name: "Hazelnut latte",
//     type: "coffee",
//     image: "/dine_in/cookies-give.jpg",
//     description: "Es kopi susu dengan citarasa kacang hazelnut",
//     variants: [
//       {
//         version: "Iced",
//         price: 22000,
//       },
//       {
//         version: "Hot",
//         price: 20000,
//       },
//     ],
//     addons: [
//       {
//         name: "Extra Shots",
//         price: 3000,
//       },
//       {
//         name: "Almond Milk",
//         price: 3000,
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Taro",
//     type: "milk-based",
//     image: "/dine_in/stack-cookies.jpg",
//     description: "Creamy taro susu",
//     variants: [
//       {
//         version: "Iced",
//         price: 22000,
//       },
//       {
//         version: "Hot",
//         price: 2000,
//       },
//     ],
//     addons: [
//       {
//         name: "Cheese Cream",
//         price: 3000,
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: "Almond Croissant",
//     type: "pastry",
//     image: "/dine_in/cookies-give.jpg",
//     description: "Fresh croisant dengan taburan kacang almond",
//     variants: [
//       {
//         version: "Reg",
//         price: 13000,
//       },
//     ],
//     addons: [],
//   },
//   {
//     id: 5,
//     name: "Roti Bakar",
//     type: "snack",
//     image: "/dine_in/stack-cookies.jpg",
//     description: "6 potong roti bakar dengan pilihan rasa",
//     variants: [
//       {
//         version: "Coco Crunchy",
//         price: 15000,
//       },
//       {
//         version: "Tiramisu",
//         price: 15000,
//       },
//     ],
//     addons: [],
//   },
// ];

// const categories = [
//   {
//     id: 1,
//     type: "coffee",
//   },
//   {
//     id: 2,
//     type: "signature",
//   },
//   {
//     id: 3,
//     type: "snack",
//   },
//   {
//     id: 4,
//     type: "pastry",
//   },
//   {
//     id: 5,
//     type: "milk-based",
//   },
// ];

const fetchProductsByCategory = async (category) => {
  const res = await fetch(`http://localhost:3000/api/product?category=${category}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('failed to fetch data');
  }

  return res.json();
};


function MainMenu({ onSelectProduct, categories }) {
  const [menu, setMenu] = useState([]);
  const [catSelected, setCatSelected] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsByCategory(catSelected);
        setMenu(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [catSelected]);

  function handleSelectedCat(selection) {
    setCatSelected(selection);
  }


  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <div className="custom-scrollbar-x to-transparent xs:top-24 z-8 sticky top-20 overflow-x-auto bg-gradient-to-b from-bcprimary via-bcprimary backdrop-blur-sm border-b border-bcprimary/20">
         <Category
          category={categories}
          catSelected={catSelected}
          onSelectedCat={handleSelectedCat}
        /> 
      </div>
      
      {menu.length > 0 ? (
        <div className="overflow-y-auto px-12 pt-6">
          <ul className="grid grid-cols-2 gap-5">
            {menu.map((items) => (
              <MenuList
                menu={items}
                key={items.id}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </ul>
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
