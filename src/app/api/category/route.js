import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}

// GET all categories
export async function GET(req) {
    try {
      const categories = await prisma.category.findMany();
      
      // Konversi BigInt ke string jika diperlukan
      const categoriesObj = categories.map(category => ({
        ...category,
        id: category.id.toString(),
      }));
  
      return new Response(JSON.stringify(categoriesObj), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  

// POST a new category
export async function POST(req) {
    try {
      const { name } = await req.json();
  
      const newCategory = await prisma.category.create({
        data: { name },
      });
  
      // Konversi BigInt ke string jika diperlukan
      const categoryToSend = {
        ...toObject(newCategory),
        id: newCategory.id.toString(),
      };
  
      return new Response(JSON.stringify(categoryToSend), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error creating category:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
  // PUT to update a category
  export async function PUT(req) {
    try {
      const { id, name } = await req.json();
  
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { name },
      });
  
      // Konversi BigInt ke string jika diperlukan
      const categoryToSend = {
        ...toObject(updatedCategory),
        id: updatedCategory.id.toString(),
      };
  
      return new Response(JSON.stringify(categoryToSend), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error updating category:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
  // DELETE a category
  export async function DELETE(req) {
    try {
      const { id } = await req.json();
  
      await prisma.category.delete({
        where: { id },
      });
  
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting category:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
