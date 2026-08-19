import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

export async function GET(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Tell TS what the payload looks like
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as MyJwtPayload;

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error in /api/me:", e);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
