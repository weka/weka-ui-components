import React, { ReactElement } from 'react'
import ReactMarkdown from 'react-markdown'

import './markdown.scss'

function LinkRenderer(props: { href: string; children: ReactElement }) {
  return (
    <a
      href={props.href}
      target='_blank'
      rel='noreferrer'
      aria-label={`${props.children}`}
    >
      {props.children}
    </a>
  )
}

function Markdown({ children }: { children: string }) {
  return (
    <div className='markdown-wrapper'>
      <ReactMarkdown components={{ a: LinkRenderer }}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
