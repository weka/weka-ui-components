import React, { useState, useEffect } from 'react'
import Tooltip from '../../Tooltip'
import { Arrow, LastArrow } from '../../../svgs'
import { IconButton } from '@mui/material'
import { EMPTY_STRING } from '../../../consts'

import './pagination.scss'

interface PaginationProps {
  onPageChange: (page: number) => void
  totalRows: number
  rowsPerPage: number
  defaultCurrentPage: number
  isLoading?: boolean
}

function Pagination({ onPageChange, totalRows, rowsPerPage, defaultCurrentPage, isLoading }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage)
  const [canPreviousPage, setCanPreviousPage] = useState(false)
  const [canNextPage, setCanNextPage] = useState(true)

  const numberOfPages = Math.ceil(totalRows / rowsPerPage)
  const onNextPage = () => setCurrentPage((prev) => prev + 1)
  const onPrevPage = () => setCurrentPage((prev) => prev - 1)

  useEffect(() => {
    setCurrentPage(defaultCurrentPage)
  }, [defaultCurrentPage])

  useEffect(() => {
    onPageChange(currentPage)
  }, [currentPage])

  useEffect(() => {
    if (numberOfPages === currentPage || numberOfPages === 0) {
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
    !isLoading ? (
    <div className='pagination-footer'>
      <div className='pagination-wrapper'>
        <div className='pagination'>
          <Tooltip data={canPreviousPage ? 'First Page' : EMPTY_STRING}>
            <div>
              <IconButton
              onClick={() => setCurrentPage(1)}
              className='pagination-arrow'
              disabled={!canPreviousPage}>
              <LastArrow
                className='rotate180'
            />
             </IconButton>
            </div>
          </Tooltip>
          <Tooltip data={canPreviousPage ? 'Previous Page' : EMPTY_STRING}>
            <div>
              <IconButton
              onClick={onPrevPage}
              className='pagination-arrow'
              disabled={!canPreviousPage}>
              <Arrow
              className='rotate90'
            />
            </IconButton>
            </div>
          </Tooltip>
          <div>
            <span className='note'>{`${currentPage} / ${numberOfPages || 1} `}</span>
          </div>
          <Tooltip data={canNextPage ? 'Next Page' : EMPTY_STRING}>
            <div>
              <IconButton
              onClick={onNextPage}
              disabled={!canNextPage}
              className='pagination-arrow'
            >
              <Arrow
              className='rotate270'
            />
              </IconButton>
            </div>

          </Tooltip>
          <Tooltip data={canNextPage ? 'Last Page' : EMPTY_STRING}>
            <div>
              <IconButton
              onClick={() => setCurrentPage(numberOfPages)}
              disabled={!canNextPage}
              className='pagination-arrow'
            >
              <LastArrow />
            </IconButton>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>)
    : null
  )
}

export default Pagination
