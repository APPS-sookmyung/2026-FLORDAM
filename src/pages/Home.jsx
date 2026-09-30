export default function Home({ goTo }) {
  return (
    <>
      <header className="hero">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">꽃을 통해 마음을 담는 서비스</div>
            <h1 className="wordmark display">FLOR-DAM</h1>
            <div className="tagline">소중한 마음, 가장 어울리는 꽃으로 전해보세요</div>
            <p className="desc">
              어떤 꽃을 골라야 할지 막막했던 적 있나요? 플로담은 상황과 취향에 맞는 꽃과 꽃말을 찾아,
              당신의 진심이 그대로 전해지도록 돕습니다.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => goTo('recommend')}>지금 추천받기</button>
              <button className="btn btn-outline" onClick={() => goTo('search')}>꽃말 검색하기</button>
            </div>
          </div>
          <div className="hero-visual"></div>
        </div>
      </header>

      <section id="features">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Core Features</div>
            <h2 className="section-title">주요 기능</h2>
            <p className="section-desc">
              플로담은 사용자가 꽃을 선물하는 과정에서 소중한 마음을 있는 그대로 전할 수 있도록 세 가지 핵심 기능을 제공합니다.
            </p>
          </div>
          <div className="features-row">
            <button className="feature-card" onClick={() => goTo('recommend')}>
              <div className="feature-num">01</div>
              <h3>상황별 추천</h3>
              <p>축하, 위로, 응원, 사랑 고백 등 상황에 맞는 꽃을 골라드립니다.</p>
              <div className="feature-arrow">추천받기 →</div>
            </button>
            <button className="feature-card" onClick={() => goTo('recommend')}>
              <div className="feature-num">02</div>
              <h3>개인 맞춤형 추천</h3>
              <p>원하는 분위기까지 함께 골라, 취향에 더 가까운 꽃을 제안합니다.</p>
              <div className="feature-arrow">추천받기 →</div>
            </button>
            <button className="feature-card" onClick={() => goTo('search')}>
              <div className="feature-num">03</div>
              <h3>꽃말 검색 및 정보</h3>
              <p>궁금한 꽃의 이름으로 꽃말과 어울리는 상황을 바로 찾아보세요.</p>
              <div className="feature-arrow">검색하기 →</div>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
