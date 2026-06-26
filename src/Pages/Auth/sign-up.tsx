import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Types/use-auth";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signUp(email, password);
      navigate("/login");
    } catch (err) {
      setError("Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Signup;