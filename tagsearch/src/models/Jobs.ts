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
