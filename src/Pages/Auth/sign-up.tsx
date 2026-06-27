import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Hooks/use-auth";
import "../../Styles/signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch {
      setError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <p className="form-badge">GET STARTED FREE</p>
      <h1 className="form-title">Create your account</h1>
      <p className="form-subtitle">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="name-row">
          <div className="form-group">
            <label htmlFor="su-first">First Name</label>
            <input
              id="su-first"
              type="text"
              placeholder="Amelia"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="su-last">Last Name</label>
            <input
              id="su-last"
              type="text"
              placeholder="John"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="su-email">Email address</label>
          <input
            id="su-email"
            type="email"
            placeholder="amelia@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="su-pw">Password</label>
          <div className="pw-wrap">
            <input
              id="su-pw"
              type={showPw ? "text" : "password"}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create free account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
