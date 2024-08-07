import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export const GET = async () => {
  try {
    const users = await prisma.user.findMany();
    const user = toObject(users);
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: "ada yang error nihh" }), {
      status: 500,
    });
  }
};

export const PUT = async (req) => {
  try {
    const { id, name, email, role } = await req.json();

    if (!id || !name || !email || !role) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, role },
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: "ada yang error nihh" }), {
      status: 500,
    });
  }
};

export const DELETE = async (req) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(JSON.stringify({ message: "User deleted successfully" }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: "ada yang error nihh" }), {
      status: 500,
    });
  }
};
