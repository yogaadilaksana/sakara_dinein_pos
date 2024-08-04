// // src/app/api/file/route.js
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.resolve('public/uploads/')
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname);
//     }
//   }),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

// const uploadMiddleware = upload.single('file');

// export async function POST(req) {
//   return new Promise((resolve, reject) => {
//     uploadMiddleware(req, {}, (err) => {
//       if (err) {
//         return new Response(`Something went wrong! ${err.message}`, { status: 500 });
//       }

//       if (!req.file) {
//         return new Response('No file uploaded', { status: 400 });
//       }

//       return new Response(JSON.stringify({ message: 'File uploaded successfully!', file: req.file }), { status: 200 });
//     });
//   });
// }

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    console.log("file inside", file);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const filePath = `./public/uploads/${file.name}`;

    await fs.writeFile(filePath, buffer);

    revalidatePath("/");

    return NextResponse.json({ status: "success", filePath });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}