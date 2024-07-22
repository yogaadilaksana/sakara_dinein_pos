function Category({ category, onSelectedCat, catSelected }) {
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
              onSelectedCat={onSelectedCat}
              catSelected={catSelected}
              key={items.type}
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
          catSelected === category.type ? "bg-qrprimary" : "bg-qraccent"
        } px-4 py-2 text-xs capitalize text-bcsecondary mr-4`}
      >
        <p>{category.type}</p>
      </button>
    </li>
  );
}

export default Category;
