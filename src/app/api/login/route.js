import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const POST = async (req) => {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`, // Set token in cookies
      },
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
