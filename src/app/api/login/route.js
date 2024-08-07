import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';

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
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return new Response(JSON.stringify({ token, role: user.role }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`, // Set token in cookies
      },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return new Response(JSON.stringify({ token, role: user.role }), {
      status: 500,
    });
  }

  const userId = token.id; // Assuming the token has the userId field
  return new Response(JSON.stringify({ userID: userId }), {
    status: 200,
  });
};
