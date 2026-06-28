import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../Lib/supabase";
import "../../Styles/signup.css";

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="input-icon"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="input-icon"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Password strength validation
  const getPasswordStrength = (pw: string) => {
    if (pw.length === 0) return null;
    if (pw.length < 6) return "weak";
    if (pw.length < 8) return "fair";
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
      Boolean,
    ).length;
    if (score <= 2) return "fair";
    if (score === 3) return "good";
    return "strong";
  };

  const strength = getPasswordStrength(password);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (strength === "weak" || strength === "fair") {
      setError(
        "Password is too weak. Add uppercase letters, numbers or symbols.",
      );
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: username.trim(),
            username: username.trim(),
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError(
            "An account with this email already exists. Sign in instead.",
          );
        } else {
          setError(signUpError.message);
        }
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <p className="form-badge">&#10022; GET STARTED FREE</p>
      <h1 className="form-title">Create your account</h1>
      <p className="form-subtitle">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="form-group">
          <label htmlFor="su-username">Username</label>
          <div className="input-wrap">
            <MailIcon />
            <input
              id="su-username"
              type="text"
              placeholder="e.g. john_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="su-email">Email address</label>
          <div className="input-wrap">
            <MailIcon />
            <input
              id="su-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="su-pw">Password</label>
          <div className="pw-wrap">
            <LockIcon />
            <input
              id="su-pw"
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={{ paddingLeft: "40px" }}
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {/* Password strength indicator */}
          {strength && (
            <div className="pw-strength">
              <div className={`pw-strength-bar pw-strength-bar--${strength}`} />
              <span
                className={`pw-strength-label pw-strength-label--${strength}`}
              >
                {strength.charAt(0).toUpperCase() + strength.slice(1)}
              </span>
            </div>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create free account"}
          {!loading && <ArrowIcon />}
        </button>
      </form>
    </div>
  );
};

export default Signup;
