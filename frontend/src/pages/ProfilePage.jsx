import { useEffect, useState } from 'react';
import api from '../api/client';
import GigCard from '../components/GigCard';

export default function ProfilePage() {
  const [profileState, setProfileState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadProfile() {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/users/me');
      setProfileState(response.data);
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function selectApplicant(gigId, applicantId) {
    try {
      await api.post(`/gigs/${gigId}/select`, { applicantId });
      await loadProfile();
    } catch (selectError) {
      setError(selectError.response?.data?.message || 'Unable to select applicant');
    }
  }

  if (loading) {
    return <p className="muted">Loading profile...</p>;
  }

  if (!profileState) {
    return <p className="error-text">{error || 'Profile unavailable'}</p>;
  }

  const { profile, postedGigs, appliedGigs } = profileState;

  return (
    <section className="stack">
      <div className="card hero">
        <div>
          <span className="eyebrow">Your profile</span>
          <h1>{profile.name}</h1>
          <p>{profile.city}</p>
        </div>
        <div className="profile-chip">{profile.email}</div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <section>
        <h2>Posted Gigs</h2>
        <div className="grid">
          {postedGigs.map((gig) => (
            <article className="card gig-card" key={gig._id}>
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

              <div className="applicant-list">
                <h4>Applicants</h4>
                {gig.applicants.length === 0 ? (
                  <p className="muted">No applicants yet.</p>
                ) : (
                  gig.applicants.map((applicant) => (
                    <div className="applicant-row" key={applicant._id}>
                      <span>
                        {applicant.name} - {applicant.city}
                      </span>
                      {gig.status === 'open' ? (
                        <button className="ghost-button" onClick={() => selectApplicant(gig._id, applicant._id)} type="button">
                          Select
                        </button>
                      ) : null}
                    </div>
                  ))
                )}
                {gig.selectedApplicant ? <p className="success-text">Selected: {gig.selectedApplicant.name}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Applied Gigs</h2>
        {appliedGigs.length === 0 ? (
          <p className="muted">You have not applied to any gigs yet.</p>
        ) : (
          <div className="grid">
            {appliedGigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} showApply={false} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}