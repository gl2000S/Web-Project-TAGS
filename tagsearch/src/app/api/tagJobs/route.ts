import { NextResponse } from "next/server";
//import connectMongoDB from "../../../../config/mongodb";
import { getAllJobs, createJob } from "@/models/Jobs";
import jwt from "jsonwebtoken";

export async function GET() {
  // await connectMongoDB();
  const jobs = await getAllJobs();
  return NextResponse.json({ jobs }, { status: 200 });
}

export async function POST(req: Request) {
  // await connectMongoDB();

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

    await createJob({
      title: body.title,
      company: body.company,
      city: body.city,
      state: body.state,
      employment_type: body.employment_type,
      min_salary: body.min_salary,
      max_salary: body.max_salary,
      description: body.description,
      url: body.url,
      user_id: userId,
    });

    return NextResponse.json({ message: "Job created successfully." }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}