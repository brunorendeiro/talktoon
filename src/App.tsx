import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Face from './Face'
import { characters } from './data/characters'
import { detectLocale, kindLabel, locales, ui, voiceLangPrefix, type Locale } from './i18n'
import { getStoredConsent, loadAnalytics } from './analytics'
import CookieConsent from './CookieConsent'

const MAX_LENGTH = 240

function pickDefaultVoice(voices: SpeechSynthesisVoice[], locale: Locale): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null
  const prefix = voiceLangPrefix[locale]
  return (
    voices.find(v => v.lang.toLowerCase().startsWith(prefix)) ??
    voices.find(v => v.default) ??
    voices[0]
  )
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const t = ui[locale]

  const [text, setText] = useState(() => ui[detectLocale()].defaultText)
  const [isDefaultText, setIsDefaultText] = useState(true)
  const [spokenText, setSpokenText] = useState('')
  const [characterId, setCharacterId] = useState(characters[0].id)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState<string | null>(null)
  const [voiceAutoSelected, setVoiceAutoSelected] = useState(true)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [speaking, setSpeaking] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(0)
  const [wordRange, setWordRange] = useState<{ start: number; end: number } | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const mouthTimer = useRef<number | null>(null)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const character = characters.find(c => c.id === characterId) ?? characters[0]
  const displayName = `${character.properName}, ${kindLabel[locale][character.kind]}`

  useEffect(() => {
    window.localStorage.setItem('talktoon-locale', locale)
    document.documentElement.setAttribute('lang', locale)
    if (isDefaultText) setText(ui[locale].defaultText)
  }, [locale, isDefaultText])

  useEffect(() => {
    if (getStoredConsent() === 'granted') loadAnalytics()
  }, [])

  useEffect(() => {
    if (!supported) return
    function loadVoices() {
      const list = window.speechSynthesis.getVoices()
      if (list.length === 0) return
      setVoices(list)
    }
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [supported])

  // Re-pick the best-matching voice whenever the voice list or the UI
  // language changes, unless the user picked one manually from the dropdown.
  useEffect(() => {
    if (!voiceAutoSelected) return
    setVoiceURI(pickDefaultVoice(voices, locale)?.voiceURI ?? null)
  }, [voices, locale, voiceAutoSelected])

  const stopMouthLoop = useCallback(() => {
    if (mouthTimer.current !== null) {
      window.clearInterval(mouthTimer.current)
      mouthTimer.current = null
    }
    setMouthOpen(0)
  }, [])

  const startMouthLoop = useCallback(() => {
    stopMouthLoop()
    mouthTimer.current = window.setInterval(() => {
      setMouthOpen(0.25 + Math.random() * 0.65)
    }, 110)
  }, [stopMouthLoop])

  useEffect(() => () => {
    stopMouthLoop()
    if (supported) window.speechSynthesis.cancel()
  }, [stopMouthLoop, supported])

  function speak() {
    const trimmed = text.trim()
    if (!supported || !trimmed) return
    window.speechSynthesis.cancel()
    setMessage(null)
    setSpokenText(trimmed)

    const utterance = new SpeechSynthesisUtterance(trimmed)
    utterance.rate = rate
    utterance.pitch = pitch
    const voice = voices.find(v => v.voiceURI === voiceURI)
    if (voice) utterance.voice = voice

    utterance.onstart = () => {
      setSpeaking(true)
      startMouthLoop()
    }
    utterance.onend = () => {
      setSpeaking(false)
      stopMouthLoop()
      setWordRange(null)
    }
    utterance.onerror = () => {
      setSpeaking(false)
      stopMouthLoop()
      setWordRange(null)
      setMessage(t.speakError)
    }
    utterance.onboundary = event => {
      if (event.charIndex == null) return
      const start = event.charIndex
      const rest = trimmed.slice(start)
      const spaceIndex = rest.search(/\s/)
      const end = spaceIndex === -1 ? trimmed.length : start + spaceIndex
      setWordRange({ start, end })
    }

    window.speechSynthesis.speak(utterance)
  }

  function stop() {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
    stopMouthLoop()
    setWordRange(null)
  }

  const bubbleParts = useMemo(() => {
    if (!spokenText) return null
    if (!wordRange) return { before: spokenText, word: '', after: '' }
    return {
      before: spokenText.slice(0, wordRange.start),
      word: spokenText.slice(wordRange.start, wordRange.end),
      after: spokenText.slice(wordRange.end),
    }
  }, [spokenText, wordRange])

  return (
    <div className="app-shell">
      <div className="backdrop" aria-hidden="true" />
      <header>
        <div className="brand">
          <span className="brand-mark">TT</span>
          <div>
            <strong>TalkToon</strong>
            <small>{t.tagline}</small>
          </div>
        </div>
        <div className="locale-switch" role="group" aria-label="Language">
          {locales.map(item => (
            <button key={item.id} className={locale === item.id ? 'active' : ''} onClick={() => setLocale(item.id)}>{item.label}</button>
          ))}
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
        </section>

        {!supported && (
          <div className="empty-state">
            <span>🔇</span>
            <h2>{t.unsupportedTitle}</h2>
            <p>{t.unsupportedBody}</p>
          </div>
        )}

        {supported && (
          <>
            <section className="stage">
              <div className="character-frame" style={{ background: character.secondary }}>
                <Face character={character} displayName={displayName} mouthOpen={mouthOpen} speaking={speaking} />
              </div>

              <div className={`speech-bubble${spokenText ? ' visible' : ''}`}>
                {bubbleParts ? (
                  <p>
                    {bubbleParts.before}
                    {bubbleParts.word && <mark>{bubbleParts.word}</mark>}
                    {bubbleParts.after}
                  </p>
                ) : (
                  <p className="bubble-placeholder">{t.bubblePlaceholder}</p>
                )}
              </div>
            </section>

            <section className="character-picker">
              {characters.map(c => (
                <button
                  key={c.id}
                  className={`character-option${c.id === characterId ? ' active' : ''}`}
                  onClick={() => setCharacterId(c.id)}
                  style={{ '--option-color': c.primary } as React.CSSProperties}
                >
                  <span className="option-swatch" style={{ background: c.primary }} />
                  {c.properName}, {kindLabel[locale][c.kind]}
                </button>
              ))}
            </section>

            <section className="controls-panel">
              <label className="field">
                <span>{t.sentenceLabel}</span>
                <textarea
                  value={text}
                  maxLength={MAX_LENGTH}
                  onChange={e => { setText(e.target.value); setIsDefaultText(false) }}
                  rows={3}
                  placeholder={t.sentencePlaceholder}
                />
                <span className="char-count">{text.length}/{MAX_LENGTH}</span>
              </label>

              <div className="control-row">
                <label className="field small">
                  <span>{t.voiceLabel}</span>
                  <select value={voiceURI ?? ''} onChange={e => { setVoiceURI(e.target.value); setVoiceAutoSelected(false) }}>
                    {voices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                    ))}
                  </select>
                </label>
                <label className="field small">
                  <span>{t.speedLabel(rate.toFixed(1))}</span>
                  <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} />
                </label>
                <label className="field small">
                  <span>{t.pitchLabel(pitch.toFixed(1))}</span>
                  <input type="range" min={0} max={2} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} />
                </label>
              </div>

              <div className="actions-row">
                <button className="primary" onClick={speak} disabled={!text.trim() || speaking}>
                  {speaking ? t.speaking : t.speak}
                </button>
                <button className="ghost" onClick={stop} disabled={!speaking}>{t.stop}</button>
              </div>

              {message && <p className="error-message">{message}</p>}
            </section>
          </>
        )}
      </main>

      <footer>
        <span>{t.footerTagline}</span>
        <a href="https://vibe-portfolio-one.vercel.app/" target="_blank" rel="noreferrer">Created by Bruno Rendeiro</a>
        <span className="powered-badge">⚡ Powered by AI</span>
      </footer>
      <CookieConsent locale={locale} />
    </div>
  )
}
