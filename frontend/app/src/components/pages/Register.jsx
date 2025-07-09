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

  const [cpfError, setCpfError] = useState(false);
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

  const isValidCPF = (cpf) => {
    const cleaned = cpf.replace(/[^\d]/g, "");

    if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;

    const digits = cleaned.split("").map(Number);

    const firstCheck = digits
      .slice(0, 9)
      .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
    const firstDigit = (firstCheck * 10) % 11 % 10;

    const secondCheck = digits
      .slice(0, 10)
      .reduce((sum, digit, index) => sum + digit * (11 - index), 0);
    const secondDigit = (secondCheck * 10) % 11 % 10;

    return firstDigit === digits[9] && secondDigit === digits[10];
  };


  const handleClickRegister = async (e) => {
    e.preventDefault();

    if (!isValidCPF(values.cpf)) {
      setCpfError(true);
      toast.error("CPF inválido. Por favor, insira um CPF válido.");
      return;
    }

    setCpfError(false); // limpa o erro se CPF válido

    try {
      const response = await Axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        cpf: values.cpf,
        name: values.name,
        email: values.email,
        password: values.password,
      });

      console.log("✅ Cadastro realizado:", response.data);
      toast.success("Usuário cadastrado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("🔥 Erro ao registrar:", error.response?.data || error.message);
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
            type="email"
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
            className={cpfError ? "cpf-error" : ""}
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