import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAuth(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) return false;
  const user = verifyJwt(sessionToken);
  return user && user.role === "Super Admin"; // Only Super Admin can export/import backups
}

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized: Super Admin only" }, { status: 401 });
    }

    // Aggregate all data from all tables
    const users = await prisma.user.findMany();
    const projects = await prisma.project.findMany();
    const skills = await prisma.skill.findMany();
    const experiences = await prisma.experience.findMany();
    const certifications = await prisma.certification.findMany();
    const services = await prisma.service.findMany();
    const testimonials = await prisma.testimonial.findMany();
    const aboutSection = await prisma.aboutSection.findMany();
    const heroSection = await prisma.heroSection.findMany();
    const contactInfo = await prisma.contactInfo.findMany();
    const navigationSetting = await prisma.navigationSetting.findMany();
    const seoSetting = await prisma.seoSetting.findMany();
    const appearanceSetting = await prisma.appearanceSetting.findMany();
    const messages = await prisma.message.findMany();
    const siteSettings = await prisma.siteSetting.findMany();
    const media = await prisma.media.findMany();

    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      tables: {
        users,
        projects,
        skills,
        experiences,
        certifications,
        services,
        testimonials,
        aboutSection,
        heroSection,
        contactInfo,
        navigationSetting,
        seoSetting,
        appearanceSetting,
        messages,
        siteSettings,
        media
      }
    };

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="portfolio_backup_${Date.now()}.json"`
      }
    });
  } catch (error: any) {
    console.error("Backup Export Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate backup" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized: Super Admin only" }, { status: 401 });
    }

    const backup = await req.json();
    if (!backup.tables) {
      return NextResponse.json({ error: "Invalid backup format: missing 'tables' field" }, { status: 400 });
    }

    const { tables } = backup;

    // Execute in a transaction to roll back if anything goes wrong
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing records (in sequence to respect constraints if any exist, although SQLite has loose ones)
      await tx.project.deleteMany();
      await tx.skill.deleteMany();
      await tx.experience.deleteMany();
      await tx.certification.deleteMany();
      await tx.service.deleteMany();
      await tx.testimonial.deleteMany();
      await tx.aboutSection.deleteMany();
      await tx.heroSection.deleteMany();
      await tx.contactInfo.deleteMany();
      await tx.navigationSetting.deleteMany();
      await tx.seoSetting.deleteMany();
      await tx.appearanceSetting.deleteMany();
      await tx.message.deleteMany();
      await tx.siteSetting.deleteMany();
      await tx.media.deleteMany();
      
      // We don't delete all users to ensure the current admin session is not invalidated,
      // but we update/merge them or only overwrite others.
      // Wait, let's keep the user who is restoring, or recreate users.
      // If we restore the users list, let's make sure the current user is preserved or the password matches.
      // To be safe, we delete other users, or delete all and insert from backup.
      // If we delete all, the cookie JWT contains the user ID. If that ID doesn't exist in the restored users,
      // the user will be logged out on the next click. That's acceptable and standard, but to be safe, let's restore users too!
      await tx.user.deleteMany();

      // 2. Restore all records from backup tables if they are defined
      if (tables.users?.length) await tx.user.createMany({ data: tables.users });
      if (tables.projects?.length) await tx.project.createMany({ data: tables.projects });
      if (tables.skills?.length) await tx.skill.createMany({ data: tables.skills });
      if (tables.experiences?.length) await tx.experience.createMany({ data: tables.experiences });
      if (tables.certifications?.length) await tx.certification.createMany({ data: tables.certifications });
      if (tables.services?.length) await tx.service.createMany({ data: tables.services });
      if (tables.testimonials?.length) await tx.testimonial.createMany({ data: tables.testimonials });
      
      if (tables.aboutSection?.length) await tx.aboutSection.createMany({ data: tables.aboutSection });
      if (tables.heroSection?.length) await tx.heroSection.createMany({ data: tables.heroSection });
      if (tables.contactInfo?.length) await tx.contactInfo.createMany({ data: tables.contactInfo });
      if (tables.navigationSetting?.length) await tx.navigationSetting.createMany({ data: tables.navigationSetting });
      if (tables.seoSetting?.length) await tx.seoSetting.createMany({ data: tables.seoSetting });
      if (tables.appearanceSetting?.length) await tx.appearanceSetting.createMany({ data: tables.appearanceSetting });
      if (tables.messages?.length) await tx.message.createMany({ data: tables.messages });
      if (tables.siteSettings?.length) await tx.siteSetting.createMany({ data: tables.siteSettings });
      if (tables.media?.length) await tx.media.createMany({ data: tables.media });
    });

    return NextResponse.json({ success: true, message: "Database restored successfully" });
  } catch (error: any) {
    console.error("Backup Import Error:", error);
    return NextResponse.json({ error: error.message || "Failed to restore database from backup" }, { status: 500 });
  }
}
