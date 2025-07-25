import React, { useState, useEffect, useRef } from 'react'
import Tooltip from '../Tooltip'
import svgs from 'svgs'
import { IconButton } from '@mui/material'
import { EMPTY_STRING } from 'consts'
import { TextBox } from '../inputs'

import './pagination.scss'

const { Arrow, LastArrow } = svgs

type PaginationProps = {
  onPageChange: (page: number) => void
  defaultCurrentPage?: number
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

function Pagination(props: PaginationProps) {
  const {
    onPageChange,
    defaultCurrentPage = 1,
    isLoading,
    totalRows,
    rowsPerPage,
    numberOfPages: outerNumberOfPages,
    disablePageInput = false
  } = props

  const [currentPage, setCurrentPage] = useState(defaultCurrentPage)
  const [canPreviousPage, setCanPreviousPage] = useState(false)
  const [canNextPage, setCanNextPage] = useState(true)

  const [pageInputValue, setInputPageValue] = useState(currentPage.toString())
  const pageInputValueRef = useRef(pageInputValue)
  pageInputValueRef.current = pageInputValue

  const numberOfPages = outerNumberOfPages ?? Math.ceil(totalRows / rowsPerPage)

  useEffect(() => {
    setCurrentPage((prevPage) => {
      const pageToUpdate = Math.min(prevPage, numberOfPages) || prevPage
      setInputPageValue(pageToUpdate.toString())
      return pageToUpdate
    })
  }, [numberOfPages])

  const handlePageChange: typeof setCurrentPage = (newPageRaw) => {
    setCurrentPage((prevPage) => {
      const newPageVal =
        typeof newPageRaw === 'function' ? newPageRaw(prevPage) : newPageRaw

      if (newPageVal.toString() !== pageInputValueRef.current) {
        setInputPageValue(newPageVal.toString())
      }

      return newPageVal
    })
  }
  const onNextPage = () => handlePageChange((prev) => prev + 1)
  const onPrevPage = () => handlePageChange((prev) => prev - 1)

  const handleInputChange = () => {
    const page = Number(pageInputValue) || 1
    const newPageNumber = page > numberOfPages ? numberOfPages : page
    handlePageChange(newPageNumber)
    setInputPageValue(newPageNumber.toString())
  }

  useEffect(() => {
    handlePageChange(defaultCurrentPage)
  }, [defaultCurrentPage])

  useEffect(() => {
    onPageChange(currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  useEffect(() => {
    if (numberOfPages === currentPage || !numberOfPages) {
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

  return !isLoading ? (
    <div className='pagination-footer'>
      <div className='pagination-wrapper'>
        <div className='pagination'>
          <Tooltip data={canPreviousPage ? 'First Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                onClick={() => handlePageChange(1)}
                className='pagination-arrow'
                disabled={!canPreviousPage}
              >
                <LastArrow className='rotate180' />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip data={canPreviousPage ? 'Previous Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                onClick={onPrevPage}
                className='pagination-arrow'
                disabled={!canPreviousPage}
              >
                <Arrow className='rotate90' />
              </IconButton>
            </div>
          </Tooltip>
          <div className='page-number-wrapper'>
            <TextBox
              onChange={(val) =>
                setInputPageValue(
                  val.toString().replace(/[^0-9]/g, EMPTY_STRING)
                )
              }
              value={pageInputValue}
              maxLength={15}
              onBlur={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleInputChange()
                }
              }}
              autosize
              disabled={numberOfPages <= 1 || disablePageInput}
            />
            <span className='note'>{`/ ${numberOfPages || 1} `}</span>
          </div>
          <Tooltip data={canNextPage ? 'Next Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                onClick={onNextPage}
                disabled={!canNextPage}
                className='pagination-arrow'
              >
                <Arrow className='rotate270' />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip data={canNextPage ? 'Last Page' : EMPTY_STRING}>
            <div className='pagination-control-wrapper'>
              <IconButton
                onClick={() => handlePageChange(numberOfPages)}
                disabled={!canNextPage}
                className='pagination-arrow'
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
