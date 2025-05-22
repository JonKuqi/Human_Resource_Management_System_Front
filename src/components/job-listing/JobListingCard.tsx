import type React from "react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Briefcase, DollarSign, Calendar } from "react-feather"
import "../../styles/JobListingCard.css"

interface JobTag {
  tag_name?: string
}

interface Tenant {
  name: string
  logo: string
  description: string
}

interface JobListing {
  jobListingId: number
  tenant_id: number
  jobTitle: string
  industryId: number
  customIndustry: string | null
  location: string
  employmentType: string
  description: string
  aboutUs: string
  salaryFrom: number
  salaryTo: number
  validUntil: string
  created_at: string
  tenant: Tenant
  tags: string[]
}

interface JobListingCardProps {
  job: JobListing
}

const JobListingCard: React.FC<JobListingCardProps> = ({ job }) => {
  const formatSalary = (from?: number, to?: number) => {
  if (typeof from !== "number" || typeof to !== "number") {
    return "Salary not specified";
  }
  return `$${from.toLocaleString()} - $${to.toLocaleString()}`;
};

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-card-company">
          <img src={job.tenant.logo || "/placeholder.svg"} alt={job.tenant.name} className="company-logo" />
          <div className="company-info">
            <h3 className="company-name">{job.tenant.name}</h3>
            <p className="posted-date">Posted {formatDate(job.created_at)}</p>
          </div>
        </div>
        <Link to={`/user/jobs/${job.jobListingId}`} className="view-job-button">
          View Job
        </Link>
      </div>

      <div className="job-card-content">
        <h2 className="job-title">{job.jobTitle}</h2>

        <div className="job-details">
          <div className="job-detail">
            <MapPin size={16} className="job-detail-icon" />
            <span>{job.location}</span>
          </div>
          <div className="job-detail">
            <Briefcase size={16} className="job-detail-icon" />
            <span>{job.employmentType}</span>
          </div>
          <div className="job-detail">
            <DollarSign size={16} className="job-detail-icon" />
            <span>{formatSalary(job.salaryFrom, job.salaryTo)}</span>
          </div>
          <div className="job-detail">
            <Calendar size={16} className="job-detail-icon" />
            <span>Valid until {new Date(job.validUntil).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="job-description">
          {job.description.length > 200 ? `${job.description.substring(0, 200)}...` : job.description}
        </p>
          <div className="job-tags">
            {Array.isArray(job.tags) &&
              job.tags.map((tag) => (
                <span key={tag} className="job-tag">
                  {tag}
                </span>
              ))}
          </div>
      </div>

      <div className="job-card-footer">
        <Link to={`/jobs/${job.jobListingId}/apply`} className="apply-button">
          Apply Now
        </Link>
        <button className="save-job-button">Save Job</button>
      </div>
    </div>
  )
}

export default JobListingCard
