import type { ReactElement } from 'react'
import React from 'react'
import ReactMarkdown from 'react-markdown'

import './markdown.scss'

function LinkRenderer(props: { href: string; children: ReactElement }) {
  return (
    <a
      aria-label={`${props.children}`}
      href={props.href}
      rel='noreferrer'
      target='_blank'
    >
      {props.children}
    </a>
  )
}

function Markdown({ children }: { children: string }) {
  return (
    <div className='markdown-wrapper'>
      <ReactMarkdown components={{ a: LinkRenderer }}>{children}</ReactMarkdown>
    </div>
  )
}

export default Markdown
