"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import HeaderLogo from "./TAGS_logo";
import AddForm from "./AddForm";
import { useAuth } from "../context/AuthContext";
import TAGS_logo from "./TAGS_logo";

type ApiJob = {
  id?: string;
  userId?: string;
  _id?: string;
  title: string;
  company?: string;
  city?: string;
  state?: string;
  employment_type?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  description: string;
  url?: string;
  rate?: string; //for added jobs
  date?: string; //also for added jobs
  easyApply?: boolean;
};

export default function AuthenticatedView() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { user, isLoggedIn, isLoading } = useAuth(); 

  const [filters, setFilters] = useState({
    wsRemote: false,
    wsOnsite: false,
    wsHybrid: false,

    locAthens: true,

    jtInternship: false,
    jtPartTime: false,
    jtFullTime: false,
  });

  const [tagJobs, setTagJobs] = useState<ApiJob[]>([]);
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [easyApplyOnly, setEasyApplyOnly] = useState<boolean>(false);
  const [sortNewestFirst, setSortNewestFirst] = useState<boolean>(true);

  const [requirements, setRequirements] = useState<Record<string, boolean>>({
    Java: false,
    C: false,
    "C++": false,
  });

  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingJobData, setEditingJobData] = useState<Partial<ApiJob>>({});

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const toggleRequirement = (key: string) => {
    setRequirements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const escapeRegExp = (s: string) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const matchesRequirement = (text: string, req: string) => {
    if (!text) return false;

    const low = text.toLowerCase();
    const r = req.toLowerCase();

    if (r === "c++") return low.includes("c++");

    if (r === "c") {
      const tokens = low.split(/[^a-z0-9_]+/);
      return tokens.includes("c");
    }

    const regex = new RegExp("\\b" + escapeRegExp(r) + "\\b", "i");
    return regex.test(text);
  };

  const getLocationFilters = () => {
    if (filters.locAthens) return "Athens, GA";
    return "";
  };

  const getKeywordFilters = (): string => {
    let base = "software engineer";

    if (filters.jtInternship) {
      base = "software engineer internship";
    } else if (filters.jtPartTime) {
      base = "software engineer part-time";
    } else if (filters.jtFullTime) {
      base = "software engineer";
    }

    return base;
  };

  const getWorkstyleFilter = () => {
    if (filters.wsRemote) return "remote";
    if (filters.wsOnsite) return "onsite";
    return "";
  };

  const fetchTagJobs = async () => {
    try {
      const res = await fetch("/api/tagJobs");
      if (!res.ok) throw new Error("Failed to fetch internal jobs");
      const data = await res.json();
      setTagJobs(data.jobs);
    } catch (err) {
      console.error(err);
      setTagJobs([]);
    }
  }

  useEffect(() => {
    fetchTagJobs();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const location = getLocationFilters();
        const keyword = getKeywordFilters();
        const workstyle = getWorkstyleFilter();

        const params = new URLSearchParams({ keyword });

        if (location) {
          params.set("location", location);
        }
        if (workstyle) {
          params.set("workstyle", workstyle);
        }

        const res = await fetch(`/api/jobs?${params.toString()}`);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to fetch jobs");
        }

        const data = await res.json();
        setApiJobs(data.jobs);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        setApiJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me");
      if (!isLoggedIn) {
        return;
      }

      const data = user;
      if (data?.name) {
        setUserName(data.name);
      }
      if (data?.id) {
        setUserId(data.id);
      }
    } catch (err) {
      console.error("Failed to fetch /api/me:", err);
    }
  };

  fetchUser();
}, []);

  const handleDelete = async(jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`/api/tagJobs/${jobId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete job");
      setTagJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  }

  const handleEditClick = (job: ApiJob) => {
    setEditingJobId(job._id ?? job.id ?? null);
    setEditingJobData({
      title: job.title,
      company: job.company,
      city: job.city,
      state: job.state,
      minSalary: job.minSalary ?? undefined,
      maxSalary: job.maxSalary ?? undefined,
      description: job.description,
      url: job.url,
    });
  };
  
  const handleUpdate = async () => {
    if (!editingJobId) return;
  
    try {
      const res = await fetch(`/api/tagJobs/${editingJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingJobData),
      });
  
      if (!res.ok) throw new Error("Failed to update job");
  
      const data = await res.json();
      setTagJobs((prev) =>
        prev.map((job) => (job._id === editingJobId ? data.job : job))
      );
      setEditingJobId(null);
      setEditingJobData({});
    } catch (err) {
      console.error(err);
      alert("Failed to update job");
    }
  };
  

  const filteredApiJobs = apiJobs.filter((job) => {
    // search term
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const inTitle = job.title.toLowerCase().includes(q);
      const inDesc = job.description.toLowerCase().includes(q);
      const inCompany = job.company?.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inCompany) return false;
    }

    if (easyApplyOnly && !job.easyApply) return false;
    const selectedReqs = Object.keys(requirements).filter((k) => requirements[k]);
    if (selectedReqs.length > 0) {
      const hay = `${job.title} ${job.description}`.toLowerCase();
      if (!selectedReqs.some((req) => matchesRequirement(hay, req))) return false;
    }

    // salary range
    if (salaryRange && salaryRange !== "Any") {
      const hasMin = job.minSalary != null;
      const hasMax = job.maxSalary != null;
      const hasSalary = hasMin || hasMax;

      const avg =
        hasMin && hasMax
          ? (job.minSalary! + job.maxSalary!) / 2
          : job.minSalary ?? job.maxSalary ?? null;

      if (salaryRange === "Not specified") {
        if (hasSalary) return false;
      } else {
        if (avg == null) return false;

        if (salaryRange === "<50k" && avg >= 50_000) return false;
        if (salaryRange === ">80k" && avg <= 80_000) return false;
      }
    }

    return true;
  });

  const selectedRequirements = Object.keys(requirements).filter(
    (k) => requirements[k]
  );

  const filteredApiJobsWithReq = filteredApiJobs.filter((job) => {
    if (selectedRequirements.length === 0) return true;

    const hay = `${job.title} ${job.description} ${job.company}`.toLowerCase();
    return selectedRequirements.some((req) => matchesRequirement(hay, req));
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-alt">
      <Nav />

      {/* Heading / Logo Area */}
      <div className="bg-surface border-b border-border-subtle py-4 px-6 flex justify-center md:justify-start">
        <div className="scale-90 origin-left">
           <TAGS_logo />
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
           <div className="bg-surface p-5 rounded-lg border border-border-subtle shadow-sm sticky top-24">
                <h3 className="font-bold text-lg mb-4 text-text">Keywords</h3>
                
                {/* Active Filter Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {filters.wsRemote && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20" onClick={() => toggleFilter('wsRemote')}>Remote ✕</span>}
                    {filters.wsOnsite && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20" onClick={() => toggleFilter('wsOnsite')}>Onsite ✕</span>}
                    {filters.locAthens && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20" onClick={() => toggleFilter('locAthens')}>Athens ✕</span>}
                    {filters.jtInternship && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20" onClick={() => toggleFilter('jtInternship')}>Internship ✕</span>}
                </div>

                {/* Filter Groups */}
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-sm text-text-muted uppercase tracking-wider mb-2">Work Style</h4>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text hover:text-primary mb-1">
                            <input type="checkbox" checked={filters.wsRemote} onChange={() => toggleFilter("wsRemote")} className="rounded border-border-subtle text-primary focus:ring-secondary" />
                            Remote
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text hover:text-primary mb-1">
                            <input type="checkbox" checked={filters.wsOnsite} onChange={() => toggleFilter("wsOnsite")} className="rounded border-border-subtle text-primary focus:ring-secondary" />
                            Onsite
                        </label>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm text-text-muted uppercase tracking-wider mb-2">Location</h4>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text hover:text-primary mb-1">
                            <input type="checkbox" checked={filters.locAthens} onChange={() => toggleFilter("locAthens")} className="rounded border-border-subtle text-primary focus:ring-secondary" />
                            Athens, GA
                        </label>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm text-text-muted uppercase tracking-wider mb-2">Job Type</h4>
                         <label className="flex items-center gap-2 cursor-pointer text-sm text-text hover:text-primary mb-1">
                            <input type="checkbox" checked={filters.jtInternship} onChange={() => toggleFilter("jtInternship")} className="rounded border-border-subtle text-primary focus:ring-secondary" />
                            Internship
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text hover:text-primary mb-1">
                            <input type="checkbox" checked={filters.jtPartTime} onChange={() => toggleFilter("jtPartTime")} className="rounded border-border-subtle text-primary focus:ring-secondary" />
                            Part-Time
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text hover:text-primary mb-1">
                            <input type="checkbox" checked={filters.jtFullTime} onChange={() => toggleFilter("jtFullTime")} className="rounded border-border-subtle text-primary focus:ring-secondary" />
                            Full-Time
                        </label>
                    </div>

                     <div>
                        <h4 className="font-semibold text-sm text-text-muted uppercase tracking-wider mb-2">Requirements</h4>
                        {Object.keys(requirements).map((r) => (
                             <label key={r} className="flex items-center gap-2 cursor-pointer text-sm text-text hover:text-primary mb-1">
                                <input type="checkbox" checked={requirements[r]} onChange={() => toggleRequirement(r)} className="rounded border-border-subtle text-primary focus:ring-secondary" />
                                {r}
                            </label>
                        ))}
                    </div>
                </div>
           </div>
        </aside>

        {/* Content */}
        <section className="flex-1 min-w-0">
          {/* Top Filters / Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              className="flex-1 px-4 py-2 rounded-lg border border-border-subtle outline-none focus:ring-2 focus:ring-secondary bg-surface shadow-sm"
              placeholder="Search by keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
                    sortNewestFirst ? "bg-secondary text-white border-secondary" : "bg-surface border-border-subtle text-text hover:border-secondary"
                }`}
                onClick={() => setSortNewestFirst((v) => !v)}
                >
                Date Posted
                </button>

                <select
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors outline-none cursor-pointer ${
                    activeFilter === "salary" ? "bg-secondary text-white border-secondary" : "bg-surface border-border-subtle text-text hover:border-secondary"
                }`}
                value={salaryRange}
                onChange={(e) => {
                    setSalaryRange(e.target.value);
                    setActiveFilter("salary");
                }}
                >
                    <option value="" disabled className="text-text">Salary Range</option>
                    <option value="Any" className="text-text">Any</option>
                    <option value="<50k" className="text-text">&lt;50k</option>
                    <option value=">80k" className="text-text">&gt;80k</option>
                    <option value="Not specified" className="text-text">Not specified</option>
                </select>

                <button
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
                    easyApplyOnly ? "bg-secondary text-white border-secondary" : "bg-surface border-border-subtle text-text hover:border-secondary"
                }`}
                onClick={() => setEasyApplyOnly((v) => !v)}
                >
                Easy Apply
                </button>
            </div>
          </div>

          {/* TAGSearch Listings */}
          <h3 className="text-xl font-bold text-text mb-4 border-b border-border-subtle pb-2">TAGSearch Listings</h3>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {tagJobs.map((job) => (
              <div key={job._id || job.id} className="bg-surface p-6 rounded-lg shadow-sm border border-border-subtle hover:shadow-md transition-shadow">
                {editingJobId === (job._id || job.id) ? (
                  // EDIT MODE
                  <div className="flex flex-col gap-3">
                    <label htmlFor="edit-title" className="text-sm font-semibold text-text">Job Title</label>
                    <input
                      className="w-full px-3 py-2 rounded border border-border-subtle focus:ring-1 focus:ring-secondary outline-none"
                      value={editingJobData.title || ""}
                      onChange={(e) => setEditingJobData({ ...editingJobData, title: e.target.value })}
                      placeholder="Job Title"
                    />
                    <label htmlFor="edit-description" className="text-sm font-semibold text-text">Description</label>
                    <textarea
                      className="w-full px-3 py-2 rounded border border-border-subtle focus:ring-1 focus:ring-secondary outline-none"
                      value={editingJobData.description || ""}
                      onChange={(e) => setEditingJobData({ ...editingJobData, description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                    />
                    <div className="flex gap-2">
                        <label htmlFor="edit-minSalary" className="text-sm font-semibold text-text">Minimum Salary</label>
                         <input
                            className="w-1/2 px-3 py-2 rounded border border-border-subtle focus:ring-1 focus:ring-secondary outline-none"
                            value={editingJobData.minSalary ?? ""}
                            onChange={(e) => setEditingJobData({ ...editingJobData, minSalary: Number(e.target.value) })}
                            placeholder="Min Salary"
                            type="number"
                        />
                        <label htmlFor="edit-maxSalary" className="text-sm font-semibold text-text">Maximum Salary</label>
                        <input
                            className="w-1/2 px-3 py-2 rounded border border-border-subtle focus:ring-1 focus:ring-secondary outline-none"
                            value={editingJobData.maxSalary ?? ""}
                            onChange={(e) => setEditingJobData({ ...editingJobData, maxSalary: Number(e.target.value) })}
                            placeholder="Max Salary"
                            type="number"
                        />
                    </div>
                    
                    <div className="flex gap-3 mt-2">
                        <button onClick={handleUpdate} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover">
                            Save
                        </button>
                        <button onClick={() => setEditingJobId(null)} className="px-4 py-2 bg-white border border-border-subtle text-text rounded-lg text-sm font-medium hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-semibold text-primary">{job.title}</h4>
                        <span className="text-xs font-semibold bg-surface-alt text-text px-3 py-1 rounded-full border border-border-subtle whitespace-nowrap ml-2">
                            {job.minSalary != null && job.maxSalary != null
                                ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                                : "Salary hidden"}
                        </span>
                    </div>

                    <p className="text-sm text-text mb-3">
                      <strong className="font-semibold">{job.company}</strong> • {job.state ? `${job.city}, ${job.state}` : job.city}
                    </p>

                    <p className="text-text-muted text-sm line-clamp-3 mb-4">
                      {job.description?.slice(0, 150) ?? "No description"}...
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        {job.url && (
                        <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                        >
                            View Job
                        </a>
                        )}

                        {/* Owner Actions */}
                        {job.userId?.toString() === user?.id && (
                             <>
                                <button 
                                    onClick={() => handleEditClick(job)}
                                    className="px-4 py-2 bg-white border border-border-subtle text-text text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(job._id || job.id!)}
                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                  </>
                )}
              </div>
            ))}
            {tagJobs.length === 0 && <p className="text-text-muted italic">No local jobs found.</p>}
          </div>

          {/* External Jobs */}
          <h3 className="text-xl font-bold text-text mb-4 border-b border-border-subtle pb-2">External Jobs (JSearch API)</h3>
          {isLoading && <p className="text-text-muted">Loading jobs from API...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 gap-4">
            {filteredApiJobsWithReq.map((job) => (
              <div key={job.id} className="bg-surface p-6 rounded-lg shadow-sm border border-border-subtle hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-semibold text-primary">{job.title}</h4>
                     <span className="text-xs font-semibold bg-surface-alt text-text px-3 py-1 rounded-full border border-border-subtle whitespace-nowrap ml-2">
                        {job.minSalary != null && job.maxSalary != null
                            ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                            : "Salary hidden"}
                    </span>
                </div>

                <p className="text-sm text-text mb-3">
                    <strong className="font-semibold">{job.company}</strong> • {job.state ? `${job.city}, ${job.state}` : job.city}
                </p>

                <p className="text-text-muted text-sm line-clamp-3 mb-4">
                    {job.description ? job.description.slice(0, 150) + "..." : "No description available."}
                </p>

                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    View Job
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}