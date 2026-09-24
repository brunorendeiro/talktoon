import { useEffect, useState } from 'react'
import { getStoredConsent } from './analytics'

const AD_CLIENT = 'ca-pub-4561414438757131'
const AD_SLOT = '3229102403'

/**
 * Manual, responsive ad unit. Auto ads (enable_page_level_ads) are switched off in
 * analytics.ts, so this is the only place ads render. Only mount this component
 * where there is substantial real content on screen (e.g. next to the generated
 * speech bubble) — never on the bare input screen before the user has generated
 * anything, to stay compliant with AdSense's policy on ads served on low-content
 * screens.
 */
export default function AdSlot() {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    setGranted(getStoredConsent() === 'granted')
  }, [])

  useEffect(() => {
    if (!granted) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      /* script not loaded yet, or blocked by an ad blocker */
    }
  }, [granted])

  if (!granted) return null

  return (
    <div className="ad-slot">
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
