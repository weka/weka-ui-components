import React, { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'

import { EMPTY_STRING, EVENT_KEYS } from 'consts'
import svgs from 'svgs'

import { TextBox } from '../inputs'
import Tooltip from '../Tooltip'

import './pagination.scss'

const { Arrow, LastArrow } = svgs

type PaginationProps = {
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  disablePageInput?: boolean
} & (
  | { totalRows: number; rowsPerPage: number; numberOfPages?: undefined }
  | {
      numberOfPages: number
      totalRows?: undefined
      rowsPerPage?: undefined
    }
)

function Pagination({
  currentPage = 1,
  onPageChange,
  isLoading,
  totalRows,
  rowsPerPage,
  numberOfPages: outerNumberOfPages,
  disablePageInput = false
}: PaginationProps) {
  const [pageInputValue, setInputPageValue] = useState(currentPage.toString())

  const numberOfPages = outerNumberOfPages ?? Math.ceil(totalRows / rowsPerPage)

  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < numberOfPages && numberOfPages > 0

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage)
  }

  const handleInputChange = () => {
    const page = Number(pageInputValue) || 1
    const newPageNumber = page > numberOfPages ? numberOfPages : page
    handlePageChange(newPageNumber)
  }

  useEffect(() => {
    setInputPageValue(currentPage.toString())
  }, [currentPage])

  return !isLoading ? (
    <div className='pagination-footer'>
      <div className='pagination-wrapper'>
        <div className='pagination'>
          <Tooltip data={canPreviousPage ? 'First Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                className='pagination-arrow'
                disabled={!canPreviousPage}
                onClick={() => handlePageChange(1)}
              >
                <LastArrow className='rotate180' />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip data={canPreviousPage ? 'Previous Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                className='pagination-arrow'
                disabled={!canPreviousPage}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <Arrow className='rotate90' />
              </IconButton>
            </div>
          </Tooltip>
          <div className='page-number-wrapper'>
            <TextBox
              autosize
              disabled={numberOfPages <= 1 || disablePageInput}
              maxLength={15}
              value={pageInputValue}
              onChange={(val) =>
                setInputPageValue(
                  val.toString().replace(/[^0-9]/g, EMPTY_STRING)
                )
              }
              {...({
                onKeyPress: (e: React.KeyboardEvent) => {
                  if (e.key === EVENT_KEYS.ENTER) {
                    handleInputChange()
                  }
                },
                onBlur: handleInputChange
              } as any)}
            />
            <span className='note'>{`/ ${numberOfPages || 1} `}</span>
          </div>
          <Tooltip data={canNextPage ? 'Next Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                className='pagination-arrow'
                disabled={!canNextPage}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <Arrow className='rotate270' />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip data={canNextPage ? 'Last Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                className='pagination-arrow'
                disabled={!canNextPage}
                onClick={() => handlePageChange(numberOfPages)}
              >
                <LastArrow />
              </IconButton>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  ) : null
}

export default Pagination
