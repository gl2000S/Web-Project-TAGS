import { NextResponse } from "next/server";
import { json } from "stream/consumers";

const JSEARCH_API_URL = "https://jsearch.p.rapidapi.com/search";
const JSEARCH_HOST = "jsearch.p.rapidapi.com";

export async function GET(request: Request) {
    const apiKey = process.env.JSEARCH_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "JSEARCH_API_KEY is not defined in environment variables." },
            { status: 500 }
        );
    }

    try { 
        const { searchParams } = new URL(request.url);

        const keyword = searchParams.get("keyword") || "software engineer";
        const location = searchParams.get("location") || "";
        const workstyle = searchParams.get("workstyle");

        const hasLocation = location.trim().length > 0;

        const queryParams = new URLSearchParams({
            query: hasLocation ? `${keyword} in ${location}` : `${keyword}`,
            page: "1",
            num_pages: "2",
        });
        
        if (workstyle === "remote") {
            queryParams.set("remote", "true");
        }

        const response = await fetch(`${JSEARCH_API_URL}?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": JSEARCH_HOST,
            },
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Error response from JSearch API:", text);
            return NextResponse.json(
                { error: "Failed to fetch data from JSearch API." },
                { status: response.status }
            );
        }

        const data = await response.json();
        const rawJobs : any[] = Array.isArray(data.data) ? data.data : [];

        const jobs = rawJobs.map((job) => ({
            id: job.job_id,
            title: job.job_title,
            company: job.employer_name,
            city: job.job_city,
            state: job.job_state,
            employment_type: job.job_employment_type,
            minSalary: job.job_min_salary,
            maxSalary: job.job_max_salary,
            description: job.job_description,
            url: job.job_apply_link,
            post_date: job.job_posted_at_datetime_utc,
        }));
        
        return NextResponse.json({ jobs: jobs.slice(0, 12) }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/jobs:", (error as Error).message);
        return NextResponse.json(
            { error: "Internal Server Error." },
            { status: 500 }
        );
    }
}