import { NoteGlyph } from '../../services/click-track';

function Notehead({
  x,
  y,
  filled = true,
}: {
  x: number;
  y: number;
  filled?: boolean;
}) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx="3.4"
      ry="2.5"
      transform={`rotate(-28 ${x} ${y})`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.3}
    />
  );
}

export function NoteIcon({ glyph }: { glyph: NoteGlyph }) {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
      {glyph === 'quarter' && (
        <>
          <Notehead x={11} y={23} />
          <rect x="13.6" y="6" width="1.4" height="17" fill="currentColor" />
        </>
      )}
      {glyph === 'half' && (
        <>
          <Notehead x={11} y={23} filled={false} />
          <rect x="13.6" y="6" width="1.4" height="16" fill="currentColor" />
        </>
      )}
      {glyph === 'dottedQuarter' && (
        <>
          <Notehead x={10} y={23} />
          <rect x="12.6" y="6" width="1.4" height="17" fill="currentColor" />
          <circle cx="19" cy="23" r="1.5" fill="currentColor" />
        </>
      )}
      {glyph === 'eighth' && (
        <>
          <Notehead x={10} y={24} />
          <rect x="12.6" y="7" width="1.4" height="17" fill="currentColor" />
          <path
            d="M14 7c6 1 7 7 4 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      {glyph === 'sixteenth' && (
        <>
          <Notehead x={7} y={24} />
          <Notehead x={18} y={24} />
          <rect x="9.6" y="8" width="1.3" height="16" fill="currentColor" />
          <rect x="20.6" y="8" width="1.3" height="16" fill="currentColor" />
          <rect x="9.6" y="8" width="12.3" height="1.6" fill="currentColor" />
          <rect x="9.6" y="12" width="12.3" height="1.6" fill="currentColor" />
        </>
      )}
      {glyph === 'triplet' && (
        <>
          <Notehead x={5} y={24} />
          <Notehead x={14} y={24} />
          <Notehead x={23} y={24} />
          <rect x="7.6" y="10" width="1.2" height="14" fill="currentColor" />
          <rect x="16.6" y="10" width="1.2" height="14" fill="currentColor" />
          <rect x="25.6" y="10" width="1.2" height="14" fill="currentColor" />
          <rect x="7.6" y="10" width="19.2" height="1.5" fill="currentColor" />
          <text
            x="16"
            y="8"
            textAnchor="middle"
            fill="currentColor"
            fontSize="7"
            fontFamily="ui-sans-serif, sans-serif"
          >
            3
          </text>
        </>
      )}
      {glyph === 'sextuplet' && (
        <>
          <Notehead x={7} y={25} />
          <Notehead x={18} y={25} />
          <rect x="9.6" y="11" width="1.3" height="14" fill="currentColor" />
          <rect x="20.6" y="11" width="1.3" height="14" fill="currentColor" />
          <rect x="9.6" y="11" width="12.3" height="1.5" fill="currentColor" />
          <rect
            x="9.6"
            y="14.5"
            width="12.3"
            height="1.5"
            fill="currentColor"
          />
          <text
            x="16"
            y="9"
            textAnchor="middle"
            fill="currentColor"
            fontSize="7"
            fontFamily="ui-sans-serif, sans-serif"
          >
            3
          </text>
        </>
      )}
      {glyph === 'duplet' && (
        <>
          <Notehead x={7} y={24} />
          <Notehead x={19} y={24} />
          <rect x="9.6" y="10" width="1.3" height="14" fill="currentColor" />
          <rect x="21.6" y="10" width="1.3" height="14" fill="currentColor" />
          <rect x="9.6" y="10" width="13.3" height="1.5" fill="currentColor" />
          <text
            x="16"
            y="8"
            textAnchor="middle"
            fill="currentColor"
            fontSize="7"
            fontFamily="ui-sans-serif, sans-serif"
          >
            2
          </text>
        </>
      )}
    </svg>
  );
}
