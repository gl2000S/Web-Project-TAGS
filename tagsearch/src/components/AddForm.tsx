"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
      title: "",
      company: "TAGSearch",
      city: "",
      state: "",
      employment_type: "Full-Time",
      minSalary: "",
      maxSalary: "",
      description: "",
      url: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setSuccess(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/tagJobs", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    ...formData,
                    minSalary: formData.minSalary ? Number(formData.minSalary) : null,
                    maxSalary: formData.maxSalary ? Number(formData.maxSalary) : null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create job");
            }
            setSuccess(true);
            setFormData({
              title: "",
              company: "TAGSearch",
              city: "",
              state: "",
              employment_type: "Full-Time",
              minSalary: "",
              maxSalary: "",
              description: "",
              url: "",
            });
            router.refresh(); 
            // Optional: Redirect or clear form
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }


    };

    const inputClasses = "w-full px-4 py-2 rounded-lg border border-border-subtle outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all bg-surface";
    const labelClasses = "block text-sm font-semibold text-text mb-1";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-2xl mx-auto p-8 bg-surface rounded-xl shadow-sm border border-border-subtle mt-10">
            {error && <p className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</p>}
            {success && <p className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">Job created successfully!</p>}
            
            <h2 className="text-2xl font-bold text-text mb-2">Post a New Job</h2>

            <div>
                <label htmlFor="title" className={labelClasses}>Job Title</label>
                <input name="title" required placeholder="e.g. Software Engineer" value={formData.title} onChange={handleChange} className={inputClasses} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="city" className={labelClasses}>City</label>
                    <input name="city" required placeholder="Athens" value={formData.city} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="state" className={labelClasses}>State</label>
                    <input name="state" required placeholder="GA" value={formData.state} onChange={handleChange} className={inputClasses} />
                </div>
            </div>

            <div>
                <label htmlFor="employment_type" className={labelClasses}>Employment Type</label>
                <select name="employment_type" value={formData.employment_type} onChange={handleChange} className={inputClasses}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="minSalary" className={labelClasses}>Min Salary</label>
                    <input name="minSalary" type="number" placeholder="Min Salary" value={formData.minSalary} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="maxSalary" className={labelClasses}>Max Salary</label>
                    <input name="maxSalary" type="number" placeholder="Max Salary" value={formData.maxSalary} onChange={handleChange} className={inputClasses} />
                </div>
            </div>

            <div>
                <label htmlFor="description" className={labelClasses}>Job Description</label>
                <textarea name="description" rows={4} required placeholder="Describe the role..." value={formData.description} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
                <label htmlFor="url" className={labelClasses}>Application URL</label>
                <input name="url" placeholder="https://..." value={formData.url} onChange={handleChange} className={inputClasses} />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="mt-2 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover focus:ring-2 focus:ring-secondary focus:ring-offset-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Posting..." : "Post Job Listing"}
            </button>
        </form>
    );
}