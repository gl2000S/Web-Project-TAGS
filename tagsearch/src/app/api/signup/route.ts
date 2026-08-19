import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "../../../../config/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectMongoDB();

    // Read the JSON body from the request
    const { name, email, password } = await request.json();

    // Simple validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 400 }
      );
    }

    // Example: enforce minimum 8 characters
    if (password.length < 8) {
        return NextResponse.json(
            { error: "Password must be at least 8 characters long." },
            { status: 400 }
        );
    }

    // Hash the password using bcrypt
    const hashed = await bcrypt.hash(password, 10);

    // Create user in database
    await User.create({
      name,
      email,
      password: hashed,
    });

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
