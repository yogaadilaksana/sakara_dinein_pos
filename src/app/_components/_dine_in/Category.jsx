import { useEffect, useState } from "react";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/category", {
      cache: "no-store"
  })

  if(!res.ok) {
      throw new Error("failed to fetch data")
  }

  return res.json()
  
}


function Category({onSelectedCat}) {

  const [category, setCategory] = useState([]);
  const [catSelected, setCatSelected] = useState('');

  useEffect(() => {
    getData()
      .then(data => setCategory(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleSelectedCat = (category) => {
    setCatSelected(category.id);
    onSelectedCat(category.name);
  };

  return (
    <div className="mb-2 mt-5 px-12">
      {category.length > 0 ? (
        <ul className="flex flex-row">
          <button
            onClick={() => onSelectedCat("")}
            className={`rounded-full ${
              catSelected === "" ? "bg-qrprimary" : "bg-qraccent"
            } bg-qraccent px-4 py-2 mr-5 text-xs capitalize text-bcsecondary`}
          >
            <p>All</p>
          </button>

          {category.map((items) => (
            <CategoryList
              category={items}
              onSelectedCat={handleSelectedCat}
              catSelected={catSelected}
              key={items.id}
            />
          ))}
        </ul>
      ) : (
        <p className="mx-10 flex justify-center rounded-full bg-qrprimary py-1 font-normal text-bcprimary">
          Belum ada kategori
        </p>
      )}
    </div>
  );
}

function CategoryList({ category, onSelectedCat, catSelected }) {
  console.log(catSelected);
  return (
    <li>
      <button
        onClick={() => onSelectedCat(category)}
        className={`whitespace-nowrap rounded-full ${
          catSelected === category.name ? "bg-qrprimary" : "bg-qraccent"
        } px-4 py-2 text-xs capitalize text-bcsecondary mr-4`}
      >
        <p>{category.name}</p>
      </button>
    </li>
  );
}

export default Category;
