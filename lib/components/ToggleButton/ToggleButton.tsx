import React, { useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { EMPTY_STRING } from 'consts'

import './ToggleButton.scss'

export type Option = {
  label: string
  value: string
}

interface ToggleButtonProps {
  options: Option[]
  value: string | Array<string | null>
  onChange: (newVal: any) => void
  small?: boolean
  isDisabled?: boolean
  wrapperClass?: string
}

function ToggleButton(props: ToggleButtonProps) {
  const {
    options,
    value,
    onChange,
    small,
    wrapperClass = EMPTY_STRING,
    isDisabled
  } = props

  const elementsList = useRef<HTMLDivElement>(null)
  const instanceId = useRef(
    `toggle-button-${Math.random().toString(36).slice(2, 11)}`
  )

  const selectElement = useCallback((option: HTMLElement, pad: HTMLElement) => {
    if (option && pad) {
      const optionRect = option.getBoundingClientRect()
      const parentRect = option.parentElement?.getBoundingClientRect()
      pad.style.width = `${optionRect.width}px`
      pad.style.height = `${optionRect.height}px`
      pad.style.transform = `translateX(${
        optionRect.left - (parentRect?.left || 0)
      }px) translateY(${optionRect.top - (parentRect?.top || 0)}px)`
      pad.style.display = 'block'

      if (option.matches(':last-child')) {
        pad.style.borderRadius = '0 5px 5px 0'
      } else if (option.matches(':first-child')) {
        pad.style.borderRadius = '5px 0 0 5px'
      } else {
        pad.style.borderRadius = '0'
      }

      option.classList.add('toggle-button-option-selected')
    }
  }, [])

  const updatePadPosition = useCallback(() => {
    const instanceElement = document.getElementById(instanceId.current)
    if (elementsList.current && instanceElement) {
      Array.from(
        elementsList.current.children as HTMLCollectionOf<HTMLElement>
      ).forEach((e) => {
        e.classList.remove('toggle-button-option-selected')
      })

      const values = Array.isArray(value) ? value : [value]
      const pads = Array.from(
        instanceElement.querySelectorAll('.toggle-button-pad')
      ) as HTMLElement[]

      values.forEach((val, index) => {
        const element = Array.from(elementsList.current!.children).find(
          (child) => child.getAttribute('data-value') === val
        ) as HTMLElement
        const pad = pads[index]
        if (element && pad) {
          selectElement(element, pad)
        }
      })
    }
  }, [value, selectElement])

  useEffect(() => {
    updatePadPosition()
    const handleResize = () => {
      updatePadPosition()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updatePadPosition])

  return (
    <div
      id={instanceId.current}
      className={clsx({
        'toggle-button': true,
        'toggle-button-small': small,
        [wrapperClass]: true,
        'multi-select': Array.isArray(value),
        'toggle-button-disabled': isDisabled
      })}
    >
      {Array.isArray(value) ? (
        value.map((_, index) => (
          <div key={index} className='toggle-button-pad' />
        ))
      ) : (
        <div className='toggle-button-pad toggle-button-pad-transition' />
      )}
      <div className='toggle-button-options' ref={elementsList}>
        {options.map((option) => (
          <span
            className='toggle-button-option'
            key={option.value}
            data-value={option.value}
            onClick={() => {
              onChange(option.value)
            }}
          >
            {option.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ToggleButton
