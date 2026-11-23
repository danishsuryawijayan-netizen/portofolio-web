const segmenter =
  typeof Intl !== 'undefined' && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

const toChars = (text) =>
  segmenter ? Array.from(segmenter.segment(text), (s) => s.segment) : Array.from(text);

// Memecah teks menjadi elemen React (bukan innerHTML) agar aman dari injeksi.
export default function SplitText({ text }) {
  const chars = toChars(text);

  return (
    <span className="split">
      <span className="sr-only">{text}</span>
      {chars.map((char, index) => (
        <span
          key={`${index}-${char}`}
          className="split-char"
          aria-hidden="true"
          style={{ '--i': index }}
        >
          <span className="split-glyph">{char === ' ' ? '\u00A0' : char}</span>
        </span>
      ))}
    </span>
  );
}