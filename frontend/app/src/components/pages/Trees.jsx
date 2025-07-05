import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaUser, FaTree, FaCalendarAlt, FaHeartbeat, FaMapMarkerAlt } from "react-icons/fa";
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

    // Ajusta a altura do textarea para o conteúdo
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

    const handleSubmit = (e) => {
        e.preventDefault();

        Axios.post(`${process.env.REACT_APP_API_URL}/trees`, {
            usuName: values.usuName,
            treeName: values.treeName,
            plantingDate: values.plantingDate,
            lifecondition: values.lifecondition,
            location: values.location,
            usuario_id: usuarioId
        })
            .then(() => {
                setShowSuccessPopup(true);
            })
            .catch((error) => {
                console.error("Erro ao registrar árvore:", error);
                alert("Erro ao registrar árvore. Verifique o console para mais detalhes.");
            });
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate("/monitoring");
    };

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
                            type="text"
                            placeholder="Data de Plantio"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = values.plantingDate ? "date" : "text")}
                            required
                            id="plantingDate"
                            name="plantingDate"
                            value={values.plantingDate}
                            onChange={handleChange}
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
                            style={{ position: 'absolute', top: '20px', left: '10px', color: '#555' }}
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