import { useState, useMemo } from 'react'
import flowers from '../data/flowers.json'
import FlowerCard from '../components/FlowerCard.jsx'

export default function Search({ goTo }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return flowers
    return flowers.filter((f) => f.name.includes(q) || f.meaning.includes(q))
  }, [query])

  return (
    <div>
      <div className="subpage-hero">
        <div className="wrap">
          <button className="back-link" onClick={() => goTo('home')}>← 홈으로</button>
          <div className="kicker">Look up</div>
          <h2 className="section-title">꽃말 검색</h2>
          <p className="section-desc">꽃 이름을 입력하면 꽃말과 어울리는 상황을 바로 확인할 수 있어요.</p>
        </div>
      </div>

      <div className="wrap search-body">
        <div className="search-box">
          <input
            type="text"
            placeholder="예: 장미, 프리지아, 수국..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {results.length === 0 ? (
          <div className="empty-note">'{query}'에 해당하는 꽃을 찾지 못했어요. 다른 이름으로 검색해보세요.</div>
        ) : (
          <div className="search-results">
            {results.map((f) => (
              <FlowerCard flower={f} key={f.name} variant="light" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
