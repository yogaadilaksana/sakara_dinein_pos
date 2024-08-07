import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    // Menghapus cookie sesi
    const headers = new Headers();
    headers.append('Set-Cookie', `next-auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`);

    return new Response(JSON.stringify({ message: 'Logout successful' }), {
      status: 200,
      headers: headers,
    });
  } else {
    return new Response(JSON.stringify({ message: 'No session found' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const GET = async () => {
  return new Response(JSON.stringify({ message: 'Method not allowed' }), {
    status: 405,
    headers: {
      'Allow': 'POST',
      'Content-Type': 'application/json',
    },
  });
};
