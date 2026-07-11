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

// GET messages (Admin Only)
export async function GET(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get("unread") === "true";

    const messages = await prisma.message.findMany({
      where: unreadOnly ? { read: false } : {},
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Messages GET Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch messages" }, { status: 500 });
  }
}

// POST new message (Public Submit)
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required fields" }, { status: 400 });
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        subject: subject || "No Subject",
        message
      }
    });

    return NextResponse.json({
      success: true,
      message: "Message submitted successfully",
      data: newMessage
    });
  } catch (error: any) {
    console.error("Message Submit Error:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}

// PATCH to mark as read/unread (Admin Only)
export async function PATCH(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: View-only access" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        read: Boolean(body.read)
      }
    });

    return NextResponse.json({ success: true, data: updatedMessage });
  } catch (error: any) {
    console.error("Message PATCH Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update message status" }, { status: 500 });
  }
}
