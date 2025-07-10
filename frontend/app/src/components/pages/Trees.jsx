import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaUser, FaTree, FaCalendarAlt, FaHeartbeat, FaMapMarkerAlt } from "react-icons/fa";
import { format, isAfter, parseISO, isValid } from "date-fns";
import './Trees.css';

const Trees = () => {
    const [values, setValues] = useState({
        usuName: "",
        treeName: "",
        plantingDate: "",
        lifecondition: "",
        location: ""
    });

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    const [usuarioId, setUsuarioId] = useState(null);
    const locationRef = useRef(null);

    const [dateInputType, setDateInputType] = useState("text");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("@Auth:user"));
        if (user) {
            setValues((prev) => ({
                ...prev,
                usuName: user.nome
            }));
            setUsuarioId(user.id);
        }
    }, []);

    const adjustTextareaHeight = () => {
        const el = locationRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, []);

    const handleChange = (e) => {
        setValues((prevValues) => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));

        if (e.target.name === "location") {
            adjustTextareaHeight();
        }
    };

    const handleFocusDate = () => {
        setDateInputType("date");
    };

    const handleBlurDate = () => {
        if (!values.plantingDate) {
            setDateInputType("text");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            const dataSelecionada = parseISO(values.plantingDate);
            const hoje = new Date();

            // Verifica se a data é válida e se não está no futuro
            if (!isValid(dataSelecionada)) {
                alert("Por favor, insira uma data de plantio válida no formato DD-MM-AAAA.");
                return;
            }
            if (isAfter(dataSelecionada, hoje)) {
                alert("A data de plantio não pode ser no futuro.");
                return;
            }

            Axios.post(`${process.env.REACT_APP_API_URL}/trees`, {
                usuName: values.usuName,
                treeName: values.treeName,
                // Garante que a data seja formatada corretamente para o backend
                plantingDate: format(dataSelecionada, "yyyy-MM-dd"),
                lifecondition: values.lifecondition,
                location: values.location,
                usuario_id: usuarioId
            })
                .then(() => setShowSuccessPopup(true))
                .catch((error) => {
                    console.error("Erro ao registrar árvore:", error);
                    alert("Erro ao registrar árvore. Verifique o console para mais detalhes.");
                });
        } catch (error) {
            alert("Erro inesperado ao processar a data.");
            console.error("Erro no try-catch do handleSubmit:", error);
        }
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate("/monitoring");
    };

    const maxDate = new Date().toISOString().split("T")[0];

    return (
        <>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1>Registrar Árvore</h1>

                    <div className="input-field">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            placeholder="Nome do Registrante"
                            required
                            id="usuName"
                            name="usuName"
                            value={values.usuName}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="input-field">
                        <FaTree className="input-icon" />
                        <input
                            type="text"
                            placeholder="Nome Científico da Árvore"
                            required
                            id="treeName"
                            name="treeName"
                            value={values.treeName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-field">
                        <FaCalendarAlt className="input-icon" />
                        <input
                            type={dateInputType}
                            placeholder="dd/mm/aaaa"
                            required
                            id="plantingDate"
                            name="plantingDate"
                            value={values.plantingDate}
                            onChange={handleChange}
                            max={maxDate}
                            onFocus={handleFocusDate}
                            onBlur={handleBlurDate}
                        />
                    </div>

                    <div className="input-field">
                        <FaHeartbeat className="input-icon" />
                        <select
                            required
                            id="lifecondition"
                            name="lifecondition"
                            value={values.lifecondition}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Saúde da Árvore</option>
                            <option value="Saudável">Saudável</option>
                            <option value="Doente">Doente</option>
                            <option value="Morrendo">Morrendo</option>
                        </select>
                    </div>

                    <div className="input-field">
                        <FaMapMarkerAlt
                            className="input-icon"
                            style={{
                                position: 'absolute',
                                top: '40%',
                                left: '10px',
                                transform: 'translateY(-40%)',
                                color: '#555'
                            }}
                        />
                        <textarea
                            id="location"
                            name="location"
                            placeholder="Localização"
                            required
                            rows={1.5}
                            value={values.location}
                            onChange={handleChange}
                            ref={locationRef}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                color: '#155802',
                                overflow: 'hidden',
                                resize: 'none'
                            }}
                        />
                    </div>

                    <button type="submit">Registrar Árvore</button>
                </form>
            </div>

            {showSuccessPopup && (
                <div className="success-popup-overlay">
                    <div className="success-popup">
                        <h2>Árvore registrada com sucesso!</h2>
                        <button onClick={handleClosePopup}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Trees;