import { site, t, phoneDisplay, phoneHref } from '@/lib/site'
import { ChatLauncher } from './chat-launcher'

/**
 * Server half of the assistant: resolves every string the widget needs
 * (functions cannot cross into a client component) and mounts the launcher.
 * The launcher is a button; the panel, the matcher and the knowledge file
 * only load once someone opens it, so a page with the assistant paints
 * exactly as fast as one without.
 */
export function Chat() {
  const chatbot = site.chatbot
  if (!chatbot?.enabled) return null

  const c = t.chat
  return (
    <ChatLauncher
      business={site.business.name}
      phone={phoneDisplay}
      phoneHref={phoneHref}
      contactHref="/contact"
      endpoint={chatbot.endpoint ?? ''}
      maxTurns={chatbot.maxTurns ?? 8}
      knowledgeUrl="/chatbot.json"
      labels={{
        open: c.open,
        close: c.close,
        title: c.title(site.business.name),
        greeting: c.greeting(site.business.name),
        placeholder: c.placeholder,
        send: c.send,
        thinking: c.thinking,
        you: c.you,
        quick: c.quick,
        answers: {
          hours: c.answers.hours,
          address: c.answers.address,
          phone: c.answers.phone(phoneDisplay),
          areas: c.answers.areas,
          areasMore: c.answers.areasMore(phoneDisplay),
          services: c.answers.services,
        },
        handoff: c.handoff(phoneDisplay),
        limitReached: c.limitReached(phoneDisplay),
        offline: c.offline(phoneDisplay),
        error: c.error,
        disclaimer: c.disclaimer,
        callCta: c.callCta,
        formCta: c.formCta,
        ariaPanel: c.ariaPanel,
        ariaLog: c.ariaLog,
        ariaInput: c.ariaInput,
      }}
    />
  )
}
