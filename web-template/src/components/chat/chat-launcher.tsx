'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatPanelProps } from './chat-panel'

// Code-split: the panel and the matcher are a separate chunk that the
// browser only fetches on the first click. Nothing about the assistant is
// on the critical path of the page.
const ChatPanel = dynamic(() => import('./chat-panel').then((m) => m.ChatPanel), { ssr: false })

export type ChatLauncherProps = Omit<ChatPanelProps, 'onClose' | 'returnFocusTo'>

export function ChatLauncher(props: ChatLauncherProps) {
  const [open, setOpen] = React.useState(false)
  const button = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-cta="chat-open"
        className={cn(
          // Sits above the mobile call bar; on a wide screen there is no bar.
          'fixed right-4 bottom-[5.25rem] z-40 lg:right-6 lg:bottom-6 no-print',
          'inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-brand pl-4 pr-5',
          'text-[0.9375rem] font-medium text-on-brand shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]',
          'transition-[transform,opacity] duration-200 ease-[var(--ease-out)] hover:bg-brand-deep',
          open && 'pointer-events-none translate-y-2 opacity-0'
        )}
      >
        <MessageSquare className="size-5" aria-hidden strokeWidth={1.75} />
        {props.labels.open}
      </button>

      {open && <ChatPanel {...props} onClose={() => setOpen(false)} returnFocusTo={button} />}
    </>
  )
}
