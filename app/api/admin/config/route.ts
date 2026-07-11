import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

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
    const type = url.searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Missing config type parameter" }, { status: 400 });
    }

    let result;

    switch (type) {
      case "hero":
        result = await prisma.heroSection.findUnique({
          where: { id: "default" }
        });
        if (result) {
          result = {
            ...result,
            typingText: JSON.parse(result.typingText || "[]")
          };
        }
        break;
      case "about":
        result = await prisma.aboutSection.findUnique({
          where: { id: "default" }
        });
        if (result) {
          result = {
            ...result,
            goals: JSON.parse(result.goals || "[]"),
            stats: JSON.parse(result.stats || "[]")
          };
        }
        break;
      case "contact":
        result = await prisma.contactInfo.findUnique({
          where: { id: "default" }
        });
        break;
      case "seo":
        result = await prisma.seoSetting.findUnique({
          where: { id: "default" }
        });
        break;
      case "appearance":
        result = await prisma.appearanceSetting.findUnique({
          where: { id: "default" }
        });
        break;
      case "settings":
        result = await prisma.siteSetting.findUnique({
          where: { id: "default" }
        });
        break;
      case "navigation":
        result = await prisma.navigationSetting.findMany({
          orderBy: { displayOrder: "asc" }
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid config type" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Config GET Error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve configuration" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: View-only access" }, { status: 403 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Missing config type parameter" }, { status: 400 });
    }

    const body = await req.json();
    let result;

    switch (type) {
      case "hero":
        const heroData = {
          ...body,
          typingText: JSON.stringify(body.typingText || []),
          availabilityBadge: Boolean(body.availabilityBadge)
        };
        delete heroData.id;
        result = await prisma.heroSection.upsert({
          where: { id: "default" },
          update: heroData,
          create: { id: "default", ...heroData }
        });
        break;
      case "about":
        const aboutData = {
          ...body,
          goals: JSON.stringify(body.goals || []),
          stats: JSON.stringify(body.stats || [])
        };
        delete aboutData.id;
        result = await prisma.aboutSection.upsert({
          where: { id: "default" },
          update: aboutData,
          create: { id: "default", ...aboutData }
        });
        break;
      case "contact":
        const contactData = { ...body };
        delete contactData.id;
        result = await prisma.contactInfo.upsert({
          where: { id: "default" },
          update: contactData,
          create: { id: "default", ...contactData }
        });
        break;
      case "seo":
        const seoData = { ...body };
        delete seoData.id;
        result = await prisma.seoSetting.upsert({
          where: { id: "default" },
          update: seoData,
          create: { id: "default", ...seoData }
        });
        break;
      case "appearance":
        const appData = {
          ...body,
          darkMode: Boolean(body.darkMode)
        };
        delete appData.id;
        result = await prisma.appearanceSetting.upsert({
          where: { id: "default" },
          update: appData,
          create: { id: "default", ...appData }
        });
        break;
      case "settings":
        const settingsData = {
          ...body,
          maintenanceMode: Boolean(body.maintenanceMode),
          smtpPort: body.smtpPort ? Number(body.smtpPort) : null
        };
        delete settingsData.id;
        result = await prisma.siteSetting.upsert({
          where: { id: "default" },
          update: settingsData,
          create: { id: "default", ...settingsData }
        });
        break;
      case "navigation":
        // Navigation can post an array of items to reorder or show/hide
        if (!Array.isArray(body)) {
          return NextResponse.json({ error: "Navigation payload must be an array" }, { status: 400 });
        }

        // Process sequentially
        for (const navItem of body) {
          const { sectionId, sectionName, label, href, visible, displayOrder } = navItem;
          await prisma.navigationSetting.upsert({
            where: { sectionId },
            update: { sectionName, label, href, visible, displayOrder },
            create: { sectionId, sectionName, label, href, visible, displayOrder }
          });
        }
        result = { success: true, message: "Navigation updated successfully" };
        break;
      default:
        return NextResponse.json({ error: "Invalid config type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Config PUT Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update configuration" }, { status: 500 });
  }
}
