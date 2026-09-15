import { NextResponse } from "next/server";
//import connectMongoDB from "../../../../../config/mongodb";
import {getJobById, updateJob, deleteJob} from "@/models/Jobs";
import jwt from "jsonwebtoken";

function getUserIdFromReq(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("authToken="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id;
  } catch {
    return null;
  }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // mark as Promise
  ) {

    //await connectMongoDB();
  
    const { id } = await params; // unwrap the promise
    if (!id) {
      return NextResponse.json({ error: "Job ID not provided" }, { status: 400 });
    }
  
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  
    const body = await req.json();

    await updateJob({
      id,
      title: body.title,
      company: body.company,
      city: body.city,
      state: body.state,
      min_salary: body.min_salary,
      max_salary: body.max_salary,
      description: body.description,
      url: body.url,
    });

    const updated = await getJobById(id);

    return NextResponse.json({ job: updated }, { status: 200 });
  }
  
  export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {

    //await connectMongoDB();
  
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Job ID not provided" }, { status: 400 });
    }
  
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteJob(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
  
  
