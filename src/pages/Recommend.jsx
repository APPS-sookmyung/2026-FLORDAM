import { useState, useMemo } from 'react'
import flowers from '../data/flowers.json'
import FlowerCard from '../components/FlowerCard.jsx'

const SITUATIONS = ['축하', '사랑고백', '위로', '사과', '응원', '감사', '기념일', '우정']
const MOODS = ['화사하고 발랄한', '은은하고 차분한', '강렬하고 화려한', '소박하고 다정한']

const HEADERS = {
  select: {
    title: '나에게 맞는 꽃 추천받기',
    desc: '원하는 추천 방식을 골라주세요.',
  },
  situation: {
    title: '상황별 추천',
    desc: '전하고 싶은 상황을 고르면 어울리는 꽃을 보여드려요.',
  },
  personal: {
    title: '개인 맞춤형 추천',
    desc: '상황과 분위기를 함께 골라, 취향에 더 가까운 꽃을 추천받아 보세요.',
  },
}

const hasTag = (list, value) => (list || []).includes(value)

export default function Recommend({ goTo, mode, setMode }) {
  const header = HEADERS[mode]

  return (
    <div>
      <div className="subpage-hero">
        <div className="wrap">
          {mode === 'select' ? (
            <button className="back-link" onClick={() => goTo('home')}>← 홈으로</button>
          ) : (
            <button className="back-link" onClick={() => setMode('select')}>← 추천 방식 선택으로</button>
          )}
          <div className="kicker">Try it</div>
          <h2 className="section-title">{header.title}</h2>
          <p className="section-desc">{header.desc}</p>
        </div>
      </div>

      <div className="demo-body">
        <div className="wrap">
          {mode === 'select' && <ModeSelect onSelect={setMode} />}
          {mode === 'situation' && <SituationMode />}
          {mode === 'personal' && <PersonalMode />}
        </div>
      </div>
    </div>
  )
}

function ModeSelect({ onSelect }) {
  return (
    <div className="mode-list">
      <button className="mode-card" onClick={() => onSelect('situation')}>
        <div className="mode-num">01</div>
        <div className="mode-body">
          <h3>상황별 추천</h3>
          <p>축하, 위로, 사과 등 전하고 싶은 상황 하나만 고르면 어울리는 꽃을 알려드려요.</p>
        </div>
        <div className="mode-arrow">→</div>
      </button>

      <button className="mode-card" onClick={() => onSelect('personal')}>
        <div className="mode-num">02</div>
        <div className="mode-body">
          <h3>개인 맞춤형 추천</h3>
          <p>상황에 원하는 분위기까지 더해서, 취향에 더 가까운 꽃을 추천받아 보세요.</p>
        </div>
        <div className="mode-arrow">→</div>
      </button>
    </div>
  )
}

function SituationMode() {
  const [situation, setSituation] = useState(null)

  const matches = useMemo(() => {
    if (!situation) return []
    return flowers.filter((f) => hasTag(f.situations, situation)).slice(0, 6)
  }, [situation])

  return (
    <>
      <div className="step-label">어떤 상황인가요?</div>
      <div className="chip-row">
        {SITUATIONS.map((s) => (
          <button
            key={s}
            className={`chip ${situation === s ? 'active' : ''}`}
            onClick={() => setSituation(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="result-area">
        <div className="result-hint">
          {situation
            ? <><strong>'{situation}'</strong>에 어울리는 꽃이에요.</>
            : '상황을 선택하면 추천 결과가 여기에 나타나요.'}
        </div>
        <div className="result-cards">
          {matches.map((f) => (
            <FlowerCard flower={f} key={f.id || f.name} variant="dark" />
          ))}
        </div>
      </div>
    </>
  )
}

function PersonalMode() {
  const [situation, setSituation] = useState(null)
  const [mood, setMood] = useState(null)

  const { matches, usedFallback } = useMemo(() => {
    if (!situation || !mood) return { matches: [], usedFallback: false }
    let list = flowers.filter((f) => hasTag(f.situations, situation) && hasTag(f.moods, mood))
    let fallback = false
    if (list.length === 0) {
      list = flowers.filter((f) => hasTag(f.situations, situation))
      fallback = true
    }
    return { matches: list.slice(0, 4), usedFallback: fallback }
  }, [situation, mood])

  return (
    <>
      <div className="step-label">STEP 1 · 어떤 상황인가요?</div>
      <div className="chip-row">
        {SITUATIONS.map((s) => (
          <button
            key={s}
            className={`chip ${situation === s ? 'active' : ''}`}
            onClick={() => setSituation(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="step-label">STEP 2 · 어떤 분위기를 원하시나요?</div>
      <div className="chip-row">
        {MOODS.map((m) => (
          <button
            key={m}
            className={`chip ${mood === m ? 'active' : ''}`}
            onClick={() => setMood(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="result-area">
        {!situation || !mood ? (
          <div className="result-hint">두 가지를 선택하면 추천 결과가 여기에 나타나요.</div>
        ) : (
          <div className="result-hint">
            {usedFallback
              ? <><strong>'{mood}'</strong> 분위기의 완벽한 매칭은 없지만, <strong>'{situation}'</strong>에 어울리는 꽃을 골라봤어요.</>
              : <><strong>'{situation}'</strong> · <strong>'{mood}'</strong>에 어울리는 꽃이에요.</>}
          </div>
        )}
        <div className="result-cards">
          {matches.map((f) => (
            <FlowerCard flower={f} key={f.id || f.name} variant="dark" />
          ))}
        </div>
      </div>
    </>
  )
}