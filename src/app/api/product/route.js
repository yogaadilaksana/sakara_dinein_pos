import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { NextResponse } from 'next/server';
import { promisify } from 'util';

const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}

// GET all products
export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // Include category if needed
      },
    });

    // Konversi data produk ke objek
    const productsObj = toObject(products);

    // Hitung total produk dan total harga
    const totalProducts = productsObj.length;
    const totalPrice = productsObj.reduce((acc, product) => {
      return acc + (parseInt(product.price) || 0); // Ganti 'price' dengan nama field harga yang sesuai
    }, 0);

    // Siapkan data hasil
    const result = {
      totalProducts,
      totalPrice,
      products: productsObj
    };

    // Kirimkan data dalam format JSON
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// POST a new product
export async function POST(req) {
  try {
    const { name, qty, price, category, description, image } = await req.json();
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        stock: qty,
        price,
        category_id: category,
        image: image.replace('./public', '')
      },
    });
    
    const product = toObject(newProduct)
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};



// PUT to update a product
export async function PUT(req) {
  try {
    const { id, name, stock, price, categoryId, description, image } = await req.json();
  //   const form = new formidable.IncomingForm({
  //     uploadDir: './public/uploads', // Directory to save uploads
  //     keepExtensions: true,
  // });
  
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        stock,
        price,
        categoryId,
        description,
        image
      },
    });
    const finalProduct = toObject(updatedProduct)
    return new Response(JSON.stringify(finalProduct), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// DELETE a product
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await prisma.product.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
