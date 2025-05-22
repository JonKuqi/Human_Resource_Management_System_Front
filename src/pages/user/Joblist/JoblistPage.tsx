"use client";

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
// import JobListingFilter from "../pages/../components/job-listing/JobListingFilter"
import JobListingFilter from "@/src/components/job-listing/JobListingFilter"
import JobListingCard from "@/src/components/job-listing/JobListingCard"
import JobListingPagination from "@/src/components/job-listing/JobListingPagination"
// import Navbar from "../components/Navbar"
// import "../styles/JobListingPage.css"
import "../../../styles/JobListingPage.css"


// Mock industries data for fallback
const mockIndustries = [
  { industry_id: 1, name: "Healthcare" },
  { industry_id: 2, name: "Finance" },
  { industry_id: 3, name: "Technology" },
  { industry_id: 4, name: "Education" },
  { industry_id: 5, name: "Human Resources" },
  { industry_id: 6, name: "Manufacturing" },
  { industry_id: 7, name: "Retail" },
]

const JobListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobListings, setJobListings] = useState<any[]>([])
  const [filteredListings, setFilteredListings] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get current job listings for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentListings = filteredListings.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    const fetchJobListings = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("http://localhost:8081/api/v1/public/job-listing")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setJobListings(data)

        // Apply filters from URL params
        applyFilters(data)
      } catch (err) {
        console.error("Failed to fetch job listings:", err)
        setError(err instanceof Error ? err.message : "Failed to load job listings")
        setJobListings([])
        setFilteredListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobListings()
  }, [searchParams]) // Re-fetch when search params change

  const applyFilters = (listings: any[]) => {
    const keyword = searchParams.get("keyword") || ""
    const location = searchParams.get("location") || ""
    const industry = searchParams.get("industry") || ""
    const employmentType = searchParams.get("employmentType") || ""

    let filtered = [...listings]

    if (keyword) {
      filtered = filtered.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(keyword.toLowerCase()) ||
          job.description.toLowerCase().includes(keyword.toLowerCase()),
      )
    }

    if (location) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (industry) {
      filtered = filtered.filter((job) => job.industryId === Number.parseInt(industry))
    }

    if (employmentType) {
      filtered = filtered.filter((job) => job.employment_type.toLowerCase() === employmentType.toLowerCase())
    }

    setFilteredListings(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }

const handlePageChange = (pageNumber: number) => {
  setCurrentPage(pageNumber)
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0)
  }
}


  const handleFilterSubmit = (filters: any) => {
    // Update URL params
    const params: any = {}
    if (filters.keyword) params.keyword = filters.keyword
    if (filters.location) params.location = filters.location
    if (filters.industry) params.industry = filters.industry
    if (filters.employmentType) params.employmentType = filters.employmentType

    setSearchParams(params)
  }

  return (
    <div className="job-listing-page">
      <div className="job-listing-container">
        <div className="job-listing-header">
          <h1>Find Your Perfect Job</h1>
          <p>Browse through our curated list of job opportunities</p>
        </div>

        <JobListingFilter
          industries={mockIndustries}
          onSubmit={handleFilterSubmit}
          initialValues={{
            keyword: searchParams.get("keyword") || "",
            location: searchParams.get("location") || "",
            industry: searchParams.get("industry") || "",
            employmentType: searchParams.get("employmentType") || "",
          }}
        />

        <div className="job-listing-results">
          {loading ? (
            <div className="job-listing-loading">
              <p>Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="job-listing-error">
              <p>Error: {error}</p>
              <p>Please try again later or contact support if the problem persists.</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="job-listing-empty">
              <p>No jobs found matching your criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="job-listing-count">
                <p>{filteredListings.length} jobs found</p>
              </div>

              <div className="job-listing-cards">
                {currentListings.map((job) => (
                  <JobListingCard
                    key={job.jobListingId ?? `job-${job.jobTitle}-${job.tenantId}`}
                    job={job}
                  /> 
                  ))}
              </div>

              {totalPages > 1 && (
                <JobListingPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobListingPage
