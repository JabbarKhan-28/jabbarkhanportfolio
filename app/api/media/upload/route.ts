import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

async function checkAuth(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) return null;
  return verifyJwt(sessionToken);
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: View-only access" }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get("file") as File;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided for upload" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    const uploadedItems = [];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not supported. Only PNG, JPEG, WEBP, and SVG are allowed.` },
          { status: 400 }
        );
      }

      // Read file data
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate a unique filename using timestamp and safe characters
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filename = `${Date.now()}_${cleanName}`;
      const filePath = path.join(uploadDir, filename);

      // Write file to filesystem
      await fs.writeFile(filePath, buffer);

      const url = `/uploads/${filename}`;

      // Save record in DB
      const media = await prisma.media.create({
        data: {
          filename: file.name,
          url,
          mimeType: file.type,
          size: file.size
        }
      });

      uploadedItems.push(media);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedItems.length} file(s) uploaded successfully`,
      data: uploadedItems
    });
  } catch (error: any) {
    console.error("Media Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload files" }, { status: 500 });
  }
}
