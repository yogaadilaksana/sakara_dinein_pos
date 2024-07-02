import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const POST = async (req) => {
  const { email, password, name, role } = await req.json(); // Tambahkan role disini

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already in use' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role, // Save the selected role
      },
    });

    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
  } catch (err) {
    console.error(err); // Use console.error to show detailed error
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
