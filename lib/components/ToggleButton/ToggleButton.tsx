import React, {useEffect, useRef} from 'react'

import './ToggleButton.scss'

type Option = {
    label: string
    value: string
}

interface ToggleButtonProps {
    options: Option[],
    value: string,
    onChange: (newVal: any) => void
}

function ToggleButton(props: ToggleButtonProps) {
    const {options, value, onChange} = props
    const elementsList = useRef<HTMLHeadingElement>(null)

function selectElement(option: HTMLElement) {
  if (option) {
    const pad: HTMLElement | null =
      option && option.parentNode && option.parentNode.parentNode && option.parentNode.parentNode.firstChild as HTMLElement
    if (pad) {
      pad.style.width = `${option.offsetWidth}px`
      pad.style.height = `${option.offsetHeight + 5}px`
      pad.style.transform = `translateX(${option.offsetLeft}px)`
      pad.style.display = "block";
      Array.from((option.parentNode as HTMLElement).children as HTMLCollectionOf<HTMLElement>).forEach((e: HTMLElement) => e.classList.remove("toggle-button-option-selected"))
      option.classList.add("toggle-button-option-selected")
    }
  }
}


    useEffect(() => {
        if(elementsList.current) {
            Array.from(elementsList.current.children).forEach((element) => {
                if (element.getAttribute('data-value') === value) {
                    selectElement(element as HTMLElement)
                }
            })
        }
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

export default ToggleButton
