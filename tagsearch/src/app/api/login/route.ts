import { NextResponse } from "next/server";
import connectMongoDB from "../../../../config/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // 1. Connect to MongoDB
    await connectMongoDB();

    // 2. Extract login data
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 3. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // 4. Compare submitted password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    // 5. Create a JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      // stored in .env.local. Our server uses this to sign and verify tokens sent by user logim requests.
      // Once stamped, the user can use the token to perform actions (like posting a job) that only authorized users can do
      // without logging in again until it expires.
      process.env.JWT_SECRET!,     
      { expiresIn: "7d" }
    );

    // 6. Store JWT in an HttpOnly cookie
    const response = NextResponse.json(
      { 
        message: "Login successful.",
        user: {
            id: user._id, 
            name: user.name,
            email: user.email
        }
      },
      { status: 200 }
    );

    // Cookie setting remains the same
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
