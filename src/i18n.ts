import type { CharacterKind } from './data/characters'

export type Locale = 'pt' | 'en' | 'de'

export const locales: { id: Locale; label: string }[] = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
]

// BCP-47 prefix used to prioritise a Web Speech API voice matching the UI language.
export const voiceLangPrefix: Record<Locale, string> = { pt: 'pt', en: 'en', de: 'de' }

export function detectLocale(): Locale {
  const stored = window.localStorage.getItem('talktoon-locale')
  if (stored === 'pt' || stored === 'en' || stored === 'de') return stored
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'de') return 'de'
  if (browser === 'pt') return 'pt'
  return 'en'
}

export const kindLabel: Record<Locale, Record<CharacterKind, string>> = {
  pt: { robot: 'o Robô', cat: 'a Gata', alien: 'o Alien', ghost: 'o Fantasma' },
  en: { robot: 'the Robot', cat: 'the Cat', alien: 'the Alien', ghost: 'the Ghost' },
  de: { robot: 'der Roboter', cat: 'die Katze', alien: 'der Alien', ghost: 'das Gespenst' },
}

type UiStrings = {
  tagline: string
  heroTitle: string
  heroBody: string
  unsupportedTitle: string
  unsupportedBody: string
  bubblePlaceholder: string
  sentenceLabel: string
  sentencePlaceholder: string
  defaultText: string
  voiceLabel: string
  speedLabel: (rate: string) => string
  pitchLabel: (pitch: string) => string
  speak: string
  speaking: string
  stop: string
  speakError: string
  footerTagline: string
}

export const ui: Record<Locale, UiStrings> = {
  pt: {
    tagline: 'Personagens que dizem o que escreves',
    heroTitle: 'Escreve uma frase. Escolhe uma personagem. Ouve-a a dizê-la.',
    heroBody: 'A boca sincroniza com a voz e a palavra que está a ser dita fica destacada no balão de fala.',
    unsupportedTitle: 'O teu browser não suporta a Web Speech API',
    unsupportedBody: 'Experimenta noutro browser, como Chrome ou Edge.',
    bubblePlaceholder: 'A tua frase aparece aqui quando carregares em "Falar".',
    sentenceLabel: 'A tua frase',
    sentencePlaceholder: 'Escreve aqui o que queres que a personagem diga…',
    defaultText: 'Olá! Escreve aqui a tua frase e eu digo-a em voz alta.',
    voiceLabel: 'Voz',
    speedLabel: rate => `Velocidade ${rate}×`,
    pitchLabel: pitch => `Tom ${pitch}`,
    speak: '▶ Falar',
    speaking: 'A falar…',
    stop: '■ Parar',
    speakError: 'Não foi possível falar agora. Tenta novamente.',
    footerTagline: '100% no browser — a tua frase nunca sai do dispositivo.',
  },
  en: {
    tagline: 'Characters that say what you write',
    heroTitle: 'Write a sentence. Pick a character. Hear it say it.',
    heroBody: 'The mouth syncs with the voice, and the word being said is highlighted in the speech bubble.',
    unsupportedTitle: "Your browser doesn't support the Web Speech API",
    unsupportedBody: 'Try another browser, like Chrome or Edge.',
    bubblePlaceholder: 'Your sentence shows up here once you hit "Speak".',
    sentenceLabel: 'Your sentence',
    sentencePlaceholder: 'Write what you want the character to say…',
    defaultText: 'Hi! Type your sentence here and I\'ll say it out loud.',
    voiceLabel: 'Voice',
    speedLabel: rate => `Speed ${rate}×`,
    pitchLabel: pitch => `Pitch ${pitch}`,
    speak: '▶ Speak',
    speaking: 'Speaking…',
    stop: '■ Stop',
    speakError: "Couldn't speak right now. Try again.",
    footerTagline: '100% in the browser — your sentence never leaves the device.',
  },
  de: {
    tagline: 'Figuren, die sagen, was du schreibst',
    heroTitle: 'Schreib einen Satz. Wähl eine Figur. Hör sie ihn sagen.',
    heroBody: 'Der Mund synchronisiert sich mit der Stimme, und das gerade gesprochene Wort wird in der Sprechblase hervorgehoben.',
    unsupportedTitle: 'Dein Browser unterstützt die Web Speech API nicht',
    unsupportedBody: 'Versuch es mit einem anderen Browser, z. B. Chrome oder Edge.',
    bubblePlaceholder: 'Dein Satz erscheint hier, sobald du auf "Sprechen" klickst.',
    sentenceLabel: 'Dein Satz',
    sentencePlaceholder: 'Schreib hier, was die Figur sagen soll…',
    defaultText: 'Hallo! Schreib hier deinen Satz und ich sage ihn laut.',
    voiceLabel: 'Stimme',
    speedLabel: rate => `Geschwindigkeit ${rate}×`,
    pitchLabel: pitch => `Tonhöhe ${pitch}`,
    speak: '▶ Sprechen',
    speaking: 'Spricht…',
    stop: '■ Stopp',
    speakError: 'Konnte gerade nicht sprechen. Versuch es erneut.',
    footerTagline: '100% im Browser — dein Satz verlässt nie das Gerät.',
  },
}
