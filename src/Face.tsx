import type { Character } from './data/characters'

type FaceProps = {
  character: Character
  displayName: string
  mouthOpen: number // 0 (closed) .. 1 (wide open)
  speaking: boolean
}

const mouthRy = (open: number) => 2 + open * 10
const mouthRx = (open: number) => 15 - open * 3.5

export default function Face({ character, displayName, mouthOpen, speaking }: FaceProps) {
  const { kind, primary, secondary, accent } = character
  const mRy = mouthRy(mouthOpen)
  const mRx = mouthRx(mouthOpen)

  return (
    <svg viewBox="0 0 220 220" width="100%" height="100%" role="img" aria-label={displayName}>
      <g className={`face-bob${speaking ? ' speaking' : ''}`}>
        {kind === 'robot' && (
          <>
            <rect x="30" y="20" width="10" height="26" fill={secondary} />
            <circle cx="35" cy="18" r="9" fill={accent} className="face-blink-fast" />
            <rect x="20" y="46" width="180" height="150" rx="34" fill={primary} stroke={secondary} strokeWidth="6" />
            <rect x="46" y="86" width="128" height="60" rx="16" fill="#0b1220" />
            <ellipse cx="82" cy="116" rx="12" ry="14" fill={accent} className="face-blink" />
            <ellipse cx="138" cy="116" rx="12" ry="14" fill={accent} className="face-blink" />
          </>
        )}

        {kind === 'cat' && (
          <>
            <path d="M46 60 20 14 78 46Z" fill={primary} stroke={secondary} strokeWidth="6" strokeLinejoin="round" />
            <path d="M174 60 200 14 142 46Z" fill={primary} stroke={secondary} strokeWidth="6" strokeLinejoin="round" />
            <circle cx="110" cy="126" r="86" fill={primary} stroke={secondary} strokeWidth="6" />
            <ellipse cx="78" cy="112" rx="13" ry="17" fill="#1a1030" className="face-blink" />
            <ellipse cx="142" cy="112" rx="13" ry="17" fill="#1a1030" className="face-blink" />
            <path d="M105 138 110 146 115 138Z" fill="#fb7185" />
            <path d="M8 130h44M8 146h40M168 130h44M172 146h40" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {kind === 'alien' && (
          <>
            <ellipse cx="110" cy="120" rx="78" ry="98" fill={primary} stroke={secondary} strokeWidth="6" />
            <ellipse cx="76" cy="100" rx="15" ry="22" fill="#0b1220" transform="rotate(-12 76 100)" className="face-blink" />
            <ellipse cx="144" cy="100" rx="15" ry="22" fill="#0b1220" transform="rotate(12 144 100)" className="face-blink" />
            <circle cx="110" cy="70" r="8" fill={accent} className="face-blink-fast" />
          </>
        )}

        {kind === 'ghost' && (
          <>
            <path
              d="M30 110c0-48 36-84 80-84s80 36 80 84v76c-8 0-8 14-18 14s-10-14-18-14-8 14-18 14-10-14-18-14-8 14-18 14-10-14-18-14-8 14-18 14-10-14-18-14Z"
              fill={primary}
              stroke={secondary}
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <ellipse cx="82" cy="108" rx="12" ry="15" fill={secondary} className="face-blink" />
            <ellipse cx="138" cy="108" rx="12" ry="15" fill={secondary} className="face-blink" />
          </>
        )}

        <ellipse
          cx="110"
          cy={kind === 'robot' ? 172 : kind === 'ghost' ? 156 : 152}
          rx={mRx}
          ry={mRy}
          fill="#3d1a12"
          style={{ transition: 'ry .1s ease, rx .1s ease' }}
        />
        <ellipse
          cx="110"
          cy={(kind === 'robot' ? 172 : kind === 'ghost' ? 156 : 152) + mRy * 0.15}
          rx={mRx * 0.62}
          ry={mRy * 0.5}
          fill="#f43f5e"
          style={{ transition: 'ry .1s ease, rx .1s ease, cy .1s ease' }}
        />
      </g>
    </svg>
  )
}
