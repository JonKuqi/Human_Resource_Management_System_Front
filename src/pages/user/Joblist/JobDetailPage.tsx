"use client";

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { MapPin, Briefcase, DollarSign, Calendar, ArrowLeft } from "react-feather"
import "../../../styles/JobDetailPage.css"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  user_id: number
  [key: string]: any
}


const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true)
      try {
        const jobId = Number.parseInt(id || "0")
        const response = await fetch(`https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/job-listing/${jobId}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Job not found")
          }
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setJob(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch job details:", err)
        setError(err instanceof Error ? err.message : "Failed to load job details")
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetail()
  }, [id])

  const formatSalary = (from: number, to: number) => {
    return `$${from.toLocaleString()} - $${to.toLocaleString()}`
  }
const handleApplicationSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!selectedFile) {
    alert("Please select a CV file.")
    return
  }

  const token = localStorage.getItem("token")
  if (!token) {
    alert("User not authenticated.")
    return
  }

  const decoded: DecodedToken = jwtDecode(token)
  const userId = decoded.user_id

  const applicationDto = {
    userID: userId,
    jobListingID: job.jobListingId,
  }

  const formData = new FormData()
  formData.append("data", JSON.stringify(applicationDto))
  formData.append("cv", selectedFile)

  try {
    const response = await fetch("https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/user-application/apply", {
      method: "POST",
      body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
      alert("Application submitted successfully!")
      setShowApplyForm(false)
      setSelectedFile(null)
    } else {
      alert("Failed to submit application.")
    }
  } catch (error) {
    console.error("Application error:", error)
    alert("Something went wrong.")
  }
}


  if (loading) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-container">
          <div className="job-detail-loading">
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-container">
          <div className="job-detail-error">
            <p>{error || "Job not found"}</p>
            <Link to="/user/jobs" className="back-to-jobs">
              <ArrowLeft size={16} />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <div className="job-detail-header">
          <Link to="/jobs" className="back-to-jobs">
            <ArrowLeft size={16} />
            Back to Jobs
          </Link>

          <div className="job-detail-company">
            <img src={job.tenant.logo || "/placeholder.svg"} alt={job.tenant.name} className="company-logo" />
            <div className="company-info">
              <h1 className="job-title">{job.jobTitle}</h1>
              <h2 className="company-name">{job.tenant.name}</h2>
            </div>
          </div>

          <div className="job-meta">
            <div className="job-detail">
              <MapPin size={18} className="job-detail-icon" />
              <span>{job.location}</span>
            </div>
            <div className="job-detail">
              <Briefcase size={18} className="job-detail-icon" />
              <span>{job.employmentType}</span>
            </div>
            <div className="job-detail">
              <DollarSign size={18} className="job-detail-icon" />
              <span>{formatSalary(job.salaryFrom, job.salaryTo)}</span>
            </div>
            <div className="job-detail">
              <Calendar size={18} className="job-detail-icon" />
              <span>Valid until {new Date(job.validUntil).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="job-actions">
            <button className="apply-button" onClick={() => setShowApplyForm(!showApplyForm)}>
              Apply Now
            </button>
            <button className="save-job-button">Save Job</button>
          </div>

          {showApplyForm && (
            <div className="apply-form-container">
              <h3 className="section-title">Submit Your Application</h3>
              <form onSubmit={handleApplicationSubmit}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files?.length) setSelectedFile(e.target.files[0])
                  }}
                />
                <button type="submit" className="apply-button">
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="job-detail-content">
          <div className="job-detail-main">
            <section className="job-section">
              <h3 className="section-title">Job Description</h3>
              <p className="job-description">{job.description}</p>
            </section>

            <section className="job-section">
              <h3 className="section-title">Responsibilities</h3>
              <ul className="job-list">
                {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                  job.responsibilities.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No responsibilities listed</li>
                )}
              </ul>
            </section>

            <section className="job-section">
              <h3 className="section-title">Requirements</h3>
              <ul className="job-list">
                {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                  job.requirements.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No requirements listed</li>
                )}
              </ul>
            </section>
          </div>

          <div className="job-detail-sidebar">
            <div className="company-card">
              <h3 className="section-title">About the Company</h3>
              <p className="company-description">{job.aboutUs}</p>
              <a href={job.tenant.web_link} target="_blank" rel="noopener noreferrer" className="company-website">
                Visit Website
              </a>
            </div>

            <div className="apply-card">
              <h3 className="section-title">Ready to Apply?</h3>
              <p>Submit your application now and take the next step in your career journey.</p>
              <button className="apply-button-large" onClick={() => setShowApplyForm(true)}>
                Apply for this Position
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage
