import { useState, useMemo } from 'react'
import flowers from '../data/flowers.json'
import FlowerCard from '../components/FlowerCard.jsx'

const SITUATIONS = ['축하', '사랑고백', '위로', '사과', '응원', '감사', '기념일', '우정']
const MOODS = ['화사하고 발랄한', '은은하고 차분한', '강렬하고 화려한', '소박하고 다정한']

export default function Recommend({ goTo }) {
  const [situation, setSituation] = useState(null)
  const [mood, setMood] = useState(null)

  const { matches, usedFallback } = useMemo(() => {
    if (!situation || !mood) return { matches: [], usedFallback: false }
    let list = flowers.filter((f) => f.situations.includes(situation) && f.moods.includes(mood))
    let fallback = false
    if (list.length === 0) {
      list = flowers.filter((f) => f.situations.includes(situation))
      fallback = true
    }
    return { matches: list.slice(0, 4), usedFallback: fallback }
  }, [situation, mood])

  return (
    <div>
      <div className="subpage-hero">
        <div className="wrap">
          <button className="back-link" onClick={() => goTo('home')}>← 홈으로</button>
          <div className="kicker">Try it</div>
          <h2 className="section-title">나에게 맞는 꽃 추천받기</h2>
          <p className="section-desc">전하고 싶은 상황과 원하는 분위기를 골라주세요. 두 가지를 모두 선택하면 어울리는 꽃을 보여드려요.</p>
        </div>
      </div>

      <div className="demo-body">
        <div className="wrap">
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
                <FlowerCard flower={f} key={f.name} variant="dark" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
