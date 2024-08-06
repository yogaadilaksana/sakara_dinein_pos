import { PrismaClient } from "@prisma/client";
import formidable from 'formidable';
import { IncomingForm } from 'formidable';
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
    // Fetch all data including category if needed
    const data = await prisma.Income_Expanses.findMany({
        
      });
  
      // Convert data to object
      const dataObj = toObject(data);
  
      // Calculate total income and total expense
      const totalIncome = dataObj
        .filter(item => item.type === 'INCOME')
        .reduce((acc, curr) => acc + curr.amount, 0);
        
      const totalExpense = dataObj
        .filter(item => item.type === 'EXPENSE')
        .reduce((acc, curr) => acc + curr.amount, 0);
  
      // Calculate net amount
      const netAmount = totalIncome - totalExpense;
      // Prepare result
      const result = {
        data: dataObj,
        netAmount: netAmount.toFixed(2), // Formatting to 2 decimal places
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
        image: image
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

// export async function POST(req, res) {
//   try {
//     // Wait for the middleware to process the request
//     upload.single('file')(req, res, async function (err) {
//       if (err) {
//         console.error('Error uploading file:', err);
//         return res.status(500).json({ error: 'File upload failed' });
//       }

//       // Extract fields from the request body
//       const { name, qty, price, category, description } = req.body;
//       const filePath = req.file ? `/uploads/${req.file.filename}` : null;

//       // let formData = req.formData();
//       // let body = Object.fromEntries(formData);

//       console.log("File path:", filePath);  // Log the file path
//       console.log("Form fields:", { name, qty, price, category, description });  // Log form fields

//       // Handle product creation logic here
//       const newProduct = {
//         name,
//         qty,
//         price,
//         category,
//         description,
//         image: filePath,
//       };

//       console.log(newProduct);  // Log the new product
//       return new Response(JSON.stringify(newProduct), {
//         status: 200,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       })

//     });
//   } catch (error) {
//     console.error('Error handling upload:', error);
//     return new Response(JSON.stringify(newProduct), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })
//   }
// }

// PUT to update a product
export async function PUT(req) {
  try {
    const { id, name, stock, price, categoryId, description, image } = await req.json();
    const form = new formidable.IncomingForm({
      uploadDir: './public/uploads', // Directory to save uploads
      keepExtensions: true,
  });
  
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
