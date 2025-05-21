"use client"

import type React from "react"
import "../../styles/JobListingPagination.css"

interface JobListingPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
}

const JobListingPagination: React.FC<JobListingPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = startPage + maxPagesToShow - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Always show first page
    if (startPage > 1) {
      pageNumbers.push(
        <button key={1} onClick={() => onPageChange(1)} className="pagination-button">
          1
        </button>,
      )

      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>,
        )
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>,
      )
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>,
        )
      }

      pageNumbers.push(
        <button key={totalPages} onClick={() => onPageChange(totalPages)} className="pagination-button">
          {totalPages}
        </button>,
      )
    }

    return pageNumbers
  }

  return (
    <div className="job-listing-pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button pagination-prev"
      >
        Previous
      </button>

      <div className="pagination-numbers">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button pagination-next"
      >
        Next
      </button>
    </div>
  )
}

export default JobListingPagination
