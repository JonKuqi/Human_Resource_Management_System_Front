"use client"

import type React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import "../../styles/JobListingFilter.css"
import { useState, useEffect } from "react"

interface Industry {
  industry_id: number
  name: string
}

interface JobListingFilterProps {
  industries: Industry[]
  onSubmit: (values: any) => void
  initialValues: {
    keyword: string
    location: string
    industry: string
    employmentType: string
  }
}

const JobListingFilter: React.FC<JobListingFilterProps> = ({
  onSubmit,
  initialValues,
  industries: propsIndustries,
}) => {
  const validationSchema = Yup.object({
    keyword: Yup.string(),
    location: Yup.string(),
    industry: Yup.string(),
    employmentType: Yup.string(),
  })

  const [industries, setIndustries] = useState<Industry[]>([])
  const [loadingIndustries, setLoadingIndustries] = useState(true)

  useEffect(() => {
    const fetchIndustries = async () => {
      setLoadingIndustries(true)
      try {
        const response = await fetch("http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/industry")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setIndustries(data)
      } catch (err) {
        console.error("Failed to fetch industries:", err)
        // Fall back to the provided industries if API fails
        setIndustries(propsIndustries || [])
      } finally {
        setLoadingIndustries(false)
      }
    }

    fetchIndustries()
  }, [propsIndustries])

  return (
    <div className="job-listing-filter">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
        {({ isSubmitting, resetForm }) => (
          <Form>
            <div className="filter-form">
              <div className="filter-group">
                <label htmlFor="keyword">Keywords</label>
                <Field
                  type="text"
                  name="keyword"
                  id="keyword"
                  placeholder="Job title, skills, or keywords"
                  className="filter-input"
                />
                <ErrorMessage name="keyword" component="div" className="filter-error" />
              </div>

              <div className="filter-group">
                <label htmlFor="location">Location</label>
                <Field
                  type="text"
                  name="location"
                  id="location"
                  placeholder="City, state, or remote"
                  className="filter-input"
                />
                <ErrorMessage name="location" component="div" className="filter-error" />
              </div>

              <div className="filter-group">
                <label htmlFor="industry">Industry</label>
                <Field as="select" name="industry" id="industry" className="filter-select" disabled={loadingIndustries}>
                  <option value="">All Industries</option>
                  {loadingIndustries ? (
                    <option value="" disabled>
                      Loading industries...
                    </option>
                  ) : (
                    industries.map((industry, index) => {
                    const key = industry.industry_id ?? `industry-${index}`;
                    if (!industry.industry_id) {
                      console.warn("Industry missing ID:", industry);
                    }
                    return (
                      <option key={key} value={industry.industry_id}>
                        {industry.name}
                      </option>
                    );
                  })
                  )}
                </Field>
                <ErrorMessage name="industry" component="div" className="filter-error" />
              </div>

              <div className="filter-group">
                <label htmlFor="employmentType">Employment Type</label>
                <Field as="select" name="employmentType" id="employmentType" className="filter-select">
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </Field>
                <ErrorMessage name="employmentType" component="div" className="filter-error" />
              </div>

              <div className="filter-actions">
                <button type="submit" className="filter-button-submit" disabled={isSubmitting}>
                  Search Jobs
                </button>
                <button
                  type="button"
                  className="filter-button-reset"
                  onClick={() => {
                    resetForm()
                    onSubmit({
                      keyword: "",
                      location: "",
                      industry: "",
                      employmentType: "",
                    })
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default JobListingFilter
