import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Chua dang nhap" }, { status: 401 });
    }

    let payload: Record<string, unknown>;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(escape(atob(base64)));
      payload = JSON.parse(json);
    } catch {
      return NextResponse.json({ message: "Token khong hop le" }, { status: 401 });
    }

    return NextResponse.json({
      id: payload.sub || payload.id || "unknown",
      email: payload.email || "",
      role: payload.role || "learner",
      firstName: payload.firstName || "",
      lastName: payload.lastName || "",
      schoolId: payload.schoolId,
      enterpriseId: payload.enterpriseId,
    });
  } catch {
    return NextResponse.json({ message: "Loi may chu" }, { status: 500 });
  }
}
