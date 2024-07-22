const getData = async (id) => {

    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        cache: "no-store"
})
    if(!res.ok) {
        throw new Error("failed to fetch data")
    }

    return res.json()
}

const SingleProduct = async ({ params: { id } }) => {

    const product = await getData(id)
    return (
        <>
            <h1>{product.name}</h1>
            <p>{product.price}</p>

        </>
    )
}

export default SingleProduct