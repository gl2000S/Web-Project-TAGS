import { NextResponse } from "next/server";
import connectMongoDB from "../../../../config/mongodb";
import { Job } from "@/models/Jobs";
import jwt from "jsonwebtoken";

export async function GET() {
  await connectMongoDB();
  const jobs = await Job.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ jobs }, { status: 200 });
}

export async function POST(req: Request) {
  await connectMongoDB();

  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const body = await req.json();

    const job = new Job({
      ...body,
      userId, 
    });

    await job.save();

    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
