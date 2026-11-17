export default function FlowerCard({ flower, variant = 'dark' }) {
  const situations = flower.situations || []
  return (
    <div className={`flower-card ${variant === 'light' ? 'light' : ''}`}>
      <div className="fname">{flower.name}</div>
      <div className="fmeaning">{flower.meaning}</div>
      <div className="fdesc">{flower.desc || flower.description}</div>
      <div className="tag-row">
        {situations.map((s) => (
          <span className="tag" key={s}>#{s}</span>
        ))}
      </div>
    </div>
  )
}
