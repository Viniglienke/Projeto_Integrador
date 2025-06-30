import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaUser, FaEnvelope, FaIdCard, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Login.css";

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    cpf: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleCPFChange = (e) => {
    let cpf = e.target.value;
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length <= 11) {
      cpf = cpf
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    setValues((prevValues) => ({
      ...prevValues,
      cpf: cpf
    }));
  };

  const handleClickRegister = async (e) => {
    e.preventDefault();
    try {
      Axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        cpf: values.cpf,
        name: values.name,
        email: values.email,
        password: values.password,
      });

      toast.success("Usuário cadastrado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao registrar. Verifique os dados e tente novamente.");
    }
  };

  const handleaddValues = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [value.target.name]: value.target.value,
    }));
  };

  return (
    <div className="container">
      <form onSubmit={handleClickRegister}>
        <h1>BioUrb</h1>
        <div className="input-field">
          <input
            type="text"
            placeholder="Nome"
            required
            id="name"
            name="name"
            value={values.name}
            onChange={handleaddValues}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-field">
          <input
            type="text"
            placeholder="E-mail"
            required
            id="email"
            name="email"
            value={values.email}
            onChange={handleaddValues}
          />
          <FaEnvelope className="icon" />
        </div>
        <div className="input-field">
          <input
            type="text"
            placeholder="CPF"
            required
            id="cpf"
            name="cpf"
            value={values.cpf}
            onChange={handleCPFChange}
            maxLength={14}
          />
          <FaIdCard className="icon" />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            required
            id="password"
            name="password"
            value={values.password}
            onChange={handleaddValues}
          />
          <FaLock className="icon" />
        </div>
        <button type="submit">Registrar</button>
        <div className="signup-link">
          <p>
            Já tem uma conta? <a href="/">Entrar</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;