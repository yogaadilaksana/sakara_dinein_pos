import Link from "next/link"

const getData = async (category) => {
    const res = await fetch(`http://localhost:3000/api/products?name=${category}`, {
        cache: "no-store"
    })

    if(!res.ok) {
        throw new Error("failed to fetch data")
    }

    return res.json()
    
}



const CategoryPage = async ({ params: { category } }) => {

    const products = await getData(category)
    return (
        <div className="w-screen overflow-x-scroll text-red-500">
        {/* WRAPPER */}
        <div className="w-max flex">
          {/* SINGLE ITEM */}
          {products.map((item) => (
            <Link
              href={`/product/${item.id}`}
              key={item.id}
              className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-fuchsia-50 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
            >
              
              {/* TEXT CONTAINER */}
              <div className=" flex-1 flex flex-col items-center justify-center text-center gap-4">
                <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">{item.name}</h1>
                <p className="p-4 2xl:p-8">{item.desc}</p>
                <span className="text-xl font-bold">{item.price} k</span>
                <button className="bg-red-500 text-white p-2 rounded-md">
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
}

export default CategoryPage