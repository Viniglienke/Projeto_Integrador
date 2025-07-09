import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signed } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    await signIn(data);
  };

  if (!signed) {
    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1>BioUrb</h1>
          <div className="input-field">
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>
          <button type="submit">Login</button>
          <div className="signup-link">
            <p>
              Não tem uma conta? <a href="/register">Registrar</a>{" "}
            </p>
          </div>
        </form>
      </div>
    );
  } else {
    return <Navigate to="/home" />;
  }
};

export default Login;