import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

// Helper to check user auth and permissions
async function getAuthUser(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) return null;
  return verifyJwt(sessionToken);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entity } = await params;
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    let result;

    switch (entity) {
      case "projects":
        if (id) {
          result = await prisma.project.findUnique({ where: { id } });
        } else {
          result = await prisma.project.findMany({ orderBy: { displayOrder: "asc" } });
        }
        break;
      case "skills":
        if (id) {
          result = await prisma.skill.findUnique({ where: { id } });
        } else {
          result = await prisma.skill.findMany({ orderBy: { displayOrder: "asc" } });
        }
        break;
      case "experiences":
        if (id) {
          result = await prisma.experience.findUnique({ where: { id } });
        } else {
          result = await prisma.experience.findMany({ orderBy: { displayOrder: "asc" } });
        }
        break;
      case "certifications":
        if (id) {
          result = await prisma.certification.findUnique({ where: { id } });
        } else {
          result = await prisma.certification.findMany({ orderBy: { displayOrder: "asc" } });
        }
        break;
      case "services":
        if (id) {
          result = await prisma.service.findUnique({ where: { id } });
        } else {
          result = await prisma.service.findMany({ orderBy: { displayOrder: "asc" } });
        }
        break;
      case "testimonials":
        if (id) {
          result = await prisma.testimonial.findUnique({ where: { id } });
        } else {
          result = await prisma.testimonial.findMany({ orderBy: { displayOrder: "asc" } });
        }
        break;
      case "users":
        // Only Super Admin can view user listings
        if (user.role !== "Super Admin") {
          return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
        }
        if (id) {
          result = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
        } else {
          result = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
        }
        break;
      default:
        return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Viewers cannot modify data
    if (user.role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: View-only access" }, { status: 403 });
    }

    const { entity } = await params;
    const body = await req.json();

    // Only Super Admin can manage users
    if (entity === "users" && user.role !== "Super Admin") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    let result;

    switch (entity) {
      case "projects":
        // Process skills list to string
        const projectData = {
          ...body,
          skills: Array.isArray(body.skills) ? body.skills.join(",") : (body.skills || ""),
          gallery: JSON.stringify(body.gallery || []),
          displayOrder: Number(body.displayOrder) || 0,
          featured: Boolean(body.featured),
          published: Boolean(body.published)
        };
        result = await prisma.project.create({ data: projectData });
        break;
      case "skills":
        const skillData = {
          ...body,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        result = await prisma.skill.create({ data: skillData });
        break;
      case "experiences":
        const expData = {
          ...body,
          points: JSON.stringify(body.points || []),
          displayOrder: Number(body.displayOrder) || 0
        };
        result = await prisma.experience.create({ data: expData });
        break;
      case "certifications":
        const certData = {
          ...body,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        result = await prisma.certification.create({ data: certData });
        break;
      case "services":
        const serviceData = {
          ...body,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        result = await prisma.service.create({ data: serviceData });
        break;
      case "testimonials":
        const testData = {
          ...body,
          rating: Number(body.rating) || 5,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        result = await prisma.testimonial.create({ data: testData });
        break;
      case "users":
        // Import dynamic password hash to avoid load order cycles
        const { hashPassword } = await import("@/lib/auth");
        const userData = {
          email: body.email,
          passwordHash: hashPassword(body.password || "defaultPassword123"),
          name: body.name,
          role: body.role || "Editor"
        };
        result = await prisma.user.create({
          data: userData,
          select: { id: true, email: true, name: true, role: true }
        });
        break;
      default:
        return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Viewers cannot modify data
    if (user.role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: View-only access" }, { status: 403 });
    }

    const { entity } = await params;
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    // Only Super Admin can manage users
    if (entity === "users" && user.role !== "Super Admin") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const body = await req.json();
    let result;

    switch (entity) {
      case "projects":
        const projectData = {
          ...body,
          skills: Array.isArray(body.skills) ? body.skills.join(",") : (body.skills || ""),
          gallery: JSON.stringify(body.gallery || []),
          displayOrder: Number(body.displayOrder) || 0,
          featured: Boolean(body.featured),
          published: Boolean(body.published)
        };
        delete projectData.id; // Prevent updating ID
        result = await prisma.project.update({ where: { id }, data: projectData });
        break;
      case "skills":
        const skillData = {
          ...body,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        delete skillData.id;
        result = await prisma.skill.update({ where: { id }, data: skillData });
        break;
      case "experiences":
        const expData = {
          ...body,
          points: JSON.stringify(body.points || []),
          displayOrder: Number(body.displayOrder) || 0
        };
        delete expData.id;
        result = await prisma.experience.update({ where: { id }, data: expData });
        break;
      case "certifications":
        const certData = {
          ...body,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        delete certData.id;
        result = await prisma.certification.update({ where: { id }, data: certData });
        break;
      case "services":
        const serviceData = {
          ...body,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        delete serviceData.id;
        result = await prisma.service.update({ where: { id }, data: serviceData });
        break;
      case "testimonials":
        const testData = {
          ...body,
          rating: Number(body.rating) || 5,
          displayOrder: Number(body.displayOrder) || 0,
          published: Boolean(body.published)
        };
        delete testData.id;
        result = await prisma.testimonial.update({ where: { id }, data: testData });
        break;
      case "users":
        const userData: any = {
          email: body.email,
          name: body.name,
          role: body.role
        };
        if (body.password) {
          const { hashPassword } = await import("@/lib/auth");
          userData.passwordHash = hashPassword(body.password);
        }
        result = await prisma.user.update({
          where: { id },
          data: userData,
          select: { id: true, email: true, name: true, role: true }
        });
        break;
      default:
        return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("API PUT Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Super Admin can perform DELETE operations
    if (user.role !== "Super Admin") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const { entity } = await params;
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    // Bulk deletion support
    const ids = id.split(",");

    switch (entity) {
      case "projects":
        await prisma.project.deleteMany({ where: { id: { in: ids } } });
        break;
      case "skills":
        await prisma.skill.deleteMany({ where: { id: { in: ids } } });
        break;
      case "experiences":
        await prisma.experience.deleteMany({ where: { id: { in: ids } } });
        break;
      case "certifications":
        await prisma.certification.deleteMany({ where: { id: { in: ids } } });
        break;
      case "services":
        await prisma.service.deleteMany({ where: { id: { in: ids } } });
        break;
      case "testimonials":
        await prisma.testimonial.deleteMany({ where: { id: { in: ids } } });
        break;
      case "users":
        // Protect the last super admin from deleting themselves
        const adminCount = await prisma.user.count({ where: { role: "Super Admin" } });
        const targets = await prisma.user.findMany({ where: { id: { in: ids } } });
        const targetAdmins = targets.filter(t => t.role === "Super Admin");
        
        if (targetAdmins.length >= adminCount) {
          return NextResponse.json({ error: "Cannot delete the final Super Admin account" }, { status: 400 });
        }
        await prisma.user.deleteMany({ where: { id: { in: ids } } });
        break;
      default:
        return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    console.error("API DELETE Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
