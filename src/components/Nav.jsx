export default function Nav({ page, goTo }) {
  const links = [
    { id: 'home', label: '홈' },
    { id: 'recommend', label: '추천받기' },
    { id: 'search', label: '꽃말 검색' },
  ]
  return (
    <nav>
      <div className="wrap">
        <button className="logo" onClick={() => goTo('home')}>FLOR-DAM</button>
        <ul className="navlinks">
          {links.map((l) => (
            <li key={l.id}>
              <button
                className={page === l.id ? 'active' : ''}
                onClick={() => goTo(l.id)}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
