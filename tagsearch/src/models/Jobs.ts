import pool from "../../config/mysql";

export async function getAllJobs() {
    const [rows] = (await pool.query("SELECT * FROM jobs ORDER BY created_at DESC")) as any; 
    return rows; 
    
}

export async function createJob(job : {
    title: string;
    company: string; 
    city: string; 
    state: string;
    employment_type: string;
    min_salary: number | null;
    max_salary: number | null;
    description: string;
    url: string;
    user_id: string;
} ) {

    await pool.query("INSERT INTO jobs (title, company, city, state, employment_type, min_salary, max_salary, description, url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [job.title, job.company, job.city, job.state, job.employment_type, job.min_salary, job.max_salary, job.description, job.url, job.user_id]);
}

export async function getJobById(id : string) {
    const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]) as any;

    if (rows.length == 0) {
      return null; 
    }
    return rows[0];
}

export async function updateJob(job: {
  id: string;
  title: string;
  company: string;
  city: string;
  state: string;
  min_salary: number | null;
  max_salary: number | null;
  description: string;
  url: string;
  
}) {
  await pool.query(
    "UPDATE jobs SET title = ?, company = ?, city = ?, state = ?, min_salary = ?, max_salary = ?, description = ?, url = ? WHERE id = ?",
    [job.title, job.company, job.city, job.state, job.min_salary, job.max_salary, job.description, job.url, job.id]
  );
}


export async function deleteJob(id : string) {
  await pool.query("DELETE FROM jobs WHERE id = ?", [id]);
}


/** 
import mongoose, { Schema, Document, models, model} from "mongoose";

export interface IJob extends Document {
    title: string;
    company: string;
    city: string;
    state: string;
    employment_type: string;
    minSalary: number | null;
    maxSalary: number | null;
    description: string;
    url: string;
    userId: string;
    createdAt: Date;
}

const JobSchema = new Schema<IJob>({
    title: { type: String, required: true},
    company: { type: String, required: true, default: "TAGSearch"},
    city: { type: String, required: true},
    state: { type: String, required: true},
    employment_type: { type: String, required: true, default: "Full-Time" },
    minSalary: { type: Number, default: null },
    maxSalary: { type: Number, default: null },
    description: { type: String, required: true },
    url: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String, required: true},
});

export const Job = models.Job || model<IJob>("Job", JobSchema);
*/