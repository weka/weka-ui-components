import React, { useState, useEffect } from 'react'
import Tooltip from '../../Tooltip'
import { Arrow, LastArrow } from '../../../svgs'

import './pagination.scss'

interface PaginationProps {
  onPageChange: (page: number) => void
  totalRows: number
  rowsPerPage: number
}

function Pagination({ onPageChange, totalRows, rowsPerPage }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [canPreviousPage, setCanPreviousPage] = useState(false)
  const [canNextPage, setCanNextPage] = useState(true)

  const numberOfPages = Math.ceil(totalRows / rowsPerPage)
  const onNextPage = () => setCurrentPage((prev) => prev + 1)
  const onPrevPage = () => setCurrentPage((prev) => prev - 1)

  useEffect(() => {
    onPageChange(currentPage)
  }, [currentPage])

  useEffect(() => {
    if (numberOfPages === currentPage) {
      setCanNextPage(false)
    } else {
      setCanNextPage(true)
    }
    if (currentPage === 1) {
      setCanPreviousPage(false)
    } else {
      setCanPreviousPage(true)
    }
  }, [numberOfPages, currentPage])

  return (
    numberOfPages > 1 ? (
    <div className='pagination-footer'>
      <div className='pagination-wrapper'>
        <div className='pagination'>
          <Tooltip data='First Page'>
            <LastArrow
              onClick={() => setCurrentPage(1)}
              className='rotate180'
              disabled={!canPreviousPage}
            />
          </Tooltip>
          <Tooltip data='Previous Page'>
            <Arrow
              onClick={onPrevPage}
              className='rotate90'
              disabled={!canPreviousPage}
            />
          </Tooltip>
          <span className='note'>{`${currentPage} / ${numberOfPages}`}</span>
          <Tooltip data='Next Page'>
            <Arrow
              onClick={onNextPage}
              className='rotate270'
              disabled={!canNextPage}
            />
          </Tooltip>
          <Tooltip data='Last Page'>
            <LastArrow
              onClick={() => setCurrentPage(numberOfPages)}
              disabled={!canNextPage}
            />
          </Tooltip>
        </div>
      </div>
    </div>)
    : null
  )
}

export default Pagination
