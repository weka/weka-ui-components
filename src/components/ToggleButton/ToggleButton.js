import React, { useEffect, useRef } from 'react'
import PropTypes  from 'prop-types'

import './ToggleButton.scss'

function ToggleButton(props) {
  const { options, value, onChange } = props
  const elementsList = useRef(null)

  function selectElement(option) {
    const pad = option.parentNode.parentNode.firstChild
    pad.style.width = `${option.offsetWidth}px`
    pad.style.height = `${option.offsetHeight + 5}px`
    pad.style.transform = `translateX(${option.offsetLeft}px)`
    pad.style.display = 'block'
    Array.from(option.parentNode.children).forEach((e) => e.classList.remove('toggle-button-option-selected'))
    option.classList.add('toggle-button-option-selected')
  }

  useEffect(() => {
    Array.from(elementsList.current.children).forEach((element) => {
      if (element.getAttribute('data-value') === value) {
        selectElement(element)
      }
    })
  }, [value])
  return (
    <div className='toggle-button'>
      <div className='toggle-button-pad' />
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

ToggleButton.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
export default ToggleButton
