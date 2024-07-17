import Link from "next/link"
import React from "react"

const getData = async () => {
    const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store"
    })

    if(!res.ok) {
        throw new Error("failed to fetch data")
    }

    return res.json()
    
}

const MenuPage =  async() => {
    const menu = await getData();

    return(
        <>
           <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow py-4">
        <div className="container mx-auto flex justify-center items-center">
          <h1 className="text-2xl font-bold text-center text-gray-800">Sakara Dine In App</h1>
        </div>
      </header>

        <main className="container mx-auto py-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {menu.map((item) => (
                <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden w-full">
                    <div className="p-4 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h3>
                    <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"><Link href={`/menu/${item.name}`}>View</Link></button>
                    </div>
                </div>
                ))}
            </div>
        </main>
    </div>
        </>
    )
} 

export default MenuPage