export type CharacterKind = 'robot' | 'cat' | 'alien' | 'ghost'

export type Character = {
  id: string
  kind: CharacterKind
  properName: string
  primary: string
  secondary: string
  accent: string
}

export const characters: Character[] = [
  { id: 'ziggy', kind: 'robot', properName: 'Ziggy', primary: '#7dd3fc', secondary: '#0c4a6e', accent: '#facc15' },
  { id: 'mimi', kind: 'cat', properName: 'Mimi', primary: '#fb923c', secondary: '#7c2d12', accent: '#fff7ed' },
  { id: 'zorp', kind: 'alien', properName: 'Zorp', primary: '#86efac', secondary: '#14532d', accent: '#f472b6' },
  { id: 'boo', kind: 'ghost', properName: 'Boo', primary: '#e9d5ff', secondary: '#581c87', accent: '#38bdf8' },
]
