import { Outlet, useLocation } from "react-router-dom";
import "../Styles/auth-layout.css";

const AuthLayout = () => {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  return (
    <div className="auth-layout">
      {/* Left brand panel  */}
      <aside className="auth-brand">
        {/* Third decorative circle */}
        <div className="auth-brand-circle3" />

        <div className="brand-content">
          {/* Logo */}
          <div className="brand-logo">
            <img src="/images/stash.png" alt="Stash logo" />
          </div>

          {isSignup ? (
            /* ── Signup variant ── */
            <>
              <h2 className="brand-heading">
                Start building your personal library today.
              </h2>
              <p className="brand-sub">
                Join thousands of curious minds who stash and revisit the best
                ideas on the web.
              </p>

              {/* Social proof row */}
              <div className="brand-social-proof">
                <div className="brand-avatars">
                  <img src="/images/icon.png" alt="Community members" />
                </div>
                <div className="brand-proof-right">
                  <div className="brand-stars">
                    <img src="/images/ratings.png" alt="5 star rating" />
                  </div>
                  <p className="brand-proof-text">
                    1,400+ knowledge seekers trust Stash
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* ── Login variant ── */
            <>
              <h2 className="brand-heading">
                Your Knowledge,
                <br />
                always within reach.
              </h2>
              <p className="brand-sub">
                Save, organize, and search the resources that matters most to
                you.
              </p>

              {/* Three feature callouts */}
              <ul className="brand-features">
                <li>
                  <BookmarkIcon />
                  <span>Save anything from the web instantly</span>
                </li>
                <li>
                  <GridIcon />
                  <span>Organize with collections and tags</span>
                </li>
                <li>
                  <ClockIcon />
                  <span>Rediscover resources</span>
                </li>
              </ul>
            </>
          )}
        </div>
      </aside>

      {/* Right panel */}
      <main className="auth-form-area">
        <Outlet />
      </main>
    </div>
  );
};

/* ── Icons used on login panel only ── */
const BookmarkIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const GridIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default AuthLayout;
