export default function GigCard({ gig, onApply, showApply = true }) {
  return (
    <article className="card gig-card">
      <div className="gig-card__header">
        <span className="pill">{gig.category}</span>
        <span className={`status status--${gig.status}`}>{gig.status}</span>
      </div>

      <h3>{gig.title}</h3>
      <p>{gig.description}</p>

      <div className="gig-meta">
        <strong>${gig.budget}</strong>
        <span>{gig.type}</span>
      </div>

      {showApply && gig.status === 'open' && onApply ? (
        <button className="primary-button" onClick={() => onApply(gig._id)} type="button">
          Apply
        </button>
      ) : null}
    </article>
  );
}