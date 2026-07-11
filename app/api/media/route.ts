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

export async function GET(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const filterUnused = url.searchParams.get("unused") === "true";

    // 1. Fetch all media records
    const mediaItems = await prisma.media.findMany({
      where: search ? { filename: { contains: search } } : {},
      orderBy: { createdAt: "desc" }
    });

    if (!filterUnused) {
      return NextResponse.json(mediaItems);
    }

    // 2. Identify unused media
    // Fetch all records from tables that reference images
    const projects = await prisma.project.findMany({ select: { image: true, gallery: true } });
    const skills = await prisma.skill.findMany({ select: { icon: true } });
    const certifications = await prisma.certification.findMany({ select: { image: true } });
    const testimonials = await prisma.testimonial.findMany({ select: { photo: true } });
    const about = await prisma.aboutSection.findMany({ select: { profilePic: true, heroImage: true } });
    const hero = await prisma.heroSection.findMany({ select: { profileImage: true, backgroundImage: true } });
    const settings = await prisma.siteSetting.findMany({ select: { logo: true, favicon: true } });

    // Collect all referenced URLs
    const referencedUrls = new Set<string>();

    projects.forEach(p => {
      if (p.image) referencedUrls.add(p.image);
      if (p.gallery) {
        try {
          const gallery = JSON.parse(p.gallery);
          if (Array.isArray(gallery)) {
            gallery.forEach(url => referencedUrls.add(url));
          }
        } catch (_) {}
      }
    });

    skills.forEach(s => {
      if (s.icon && s.icon.startsWith("/uploads/")) referencedUrls.add(s.icon);
    });

    certifications.forEach(c => {
      if (c.image) referencedUrls.add(c.image);
    });

    testimonials.forEach(t => {
      if (t.photo) referencedUrls.add(t.photo);
    });

    about.forEach(a => {
      if (a.profilePic) referencedUrls.add(a.profilePic);
      if (a.heroImage) referencedUrls.add(a.heroImage);
    });

    hero.forEach(h => {
      if (h.profileImage) referencedUrls.add(h.profileImage);
      if (h.backgroundImage) referencedUrls.add(h.backgroundImage);
    });

    settings.forEach(s => {
      if (s.logo) referencedUrls.add(s.logo);
      if (s.favicon) referencedUrls.add(s.favicon);
    });

    // Filter media items not in referencedUrls
    const unusedMedia = mediaItems.filter(item => !referencedUrls.has(item.url));

    return NextResponse.json(unusedMedia);
  } catch (error: any) {
    console.error("Media GET Error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve media list" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "Super Admin") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing media ID" }, { status: 400 });
    }

    const mediaItem = await prisma.media.findUnique({
      where: { id }
    });

    if (!mediaItem) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), "public", mediaItem.url);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`File on disk not found for deletion: ${filePath}`);
    }

    // Delete record from database
    await prisma.media.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error: any) {
    console.error("Media DELETE Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete media" }, { status: 500 });
  }
}
