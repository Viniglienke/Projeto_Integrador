import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Monitoring.css';
import { FaLock } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Monitoring = () => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [showSuccessDelete, setShowSuccessDelete] = useState(false);
    const [showSuccessEdit, setShowSuccessEdit] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTreeId, setReportTreeId] = useState(null);
    const [reportText, setReportText] = useState("");
    const user = JSON.parse(localStorage.getItem("@Auth:user"));
    const [trees, setTrees] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentTree, setCurrentTree] = useState({
        id: null,
        nome_registrante: '',
        nome_cientifico: '',
        data_plantio: '',
        estado_saude: '',
        localizacao: ''
    });

    useEffect(() => {
        fetchTrees();
    }, []);

    const fetchTrees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/trees');
            setTrees(response.data);
        } catch (error) {
            console.error("Erro ao buscar árvores:", error);
        }
    };

    const handleReportClick = (treeId) => {
        setReportTreeId(treeId);
        setShowReportModal(true);
    };

    const handleCloseModal = () => {
        setShowReportModal(false);
        setReportText("");
    };

    const handleSendReport = async () => {
        if (reportText.trim() === '') {
            alert('Descreva o problema antes de enviar.');
            return;
        }

        setLoading(true);

        const templateParams = {
            from_name: user.nome,
            email: user.email,
            user_id: user.id,
            tree_id: reportTreeId,
            problem_description: reportText
        };

        emailjs.send("service_vk5hd8d", "template_qviar4b", templateParams, "0EZ5fZfY7LfCvIBry")
            .then((response) => {
                console.log("EMAIL ENVIADO", response.status, response.text);
                setLoading(false);
                setSuccessMessage("Problema reportado com sucesso!");
                handleCloseModal();
            })
            .catch((err) => {
                console.log("ERRO AO ENVIAR:", err);
                setLoading(false);
                alert("Erro ao enviar o problema. Tente novamente.");
            });
    };



    const handleEditClick = (tree) => {
        setEditing(true);
        setCurrentTree({
            id: tree.id,
            nome_registrante: tree.nome_registrante,
            nome_cientifico: tree.nome_cientifico,
            data_plantio: tree.data_plantio,
            estado_saude: tree.estado_saude,
            localizacao: tree.localizacao
        });
    };

    const handleDeleteTree = async (id) => {
        try {
            setLoadingDelete(true);
            await axios.delete(`http://localhost:3001/trees/${id}`);
            fetchTrees();
            setShowSuccessDelete(true);
        } catch (error) {
            console.error('Erro ao excluir árvore', error);
        } finally {
            setLoadingDelete(false);
        }
    };

    {
        showSuccessDelete && (
            <div className="action-success-overlay">
                <div className="action-success-message">
                    <h2>Árvore excluída com sucesso!</h2>
                    <button onClick={() => setShowSuccessDelete(false)}>Fechar</button>
                </div>
            </div>
        )
    }



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTree({ ...currentTree, [name]: value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/trees/${currentTree.id}`, {
                treeName: currentTree.nome_cientifico,
                plantingDate: currentTree.data_plantio,
                lifecondition: currentTree.estado_saude,
                location: currentTree.localizacao
            });
            setEditing(false);
            fetchTrees();
            setShowSuccessEdit(true); // 👈 Adiciona isso para aparecer pop-up de edição
        } catch (error) {
            console.error("Erro ao atualizar árvore:", error);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0'); // Pega o dia UTC
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Pega o mês UTC, mas adiciona 1 porque começa em 0
        const year = date.getUTCFullYear(); // Pega o ano UTC

        return `${day}/${month}/${year}`;
    };


    return (
        <div className="monitoring-container">
            <h1 className='monitoring-title'>Monitoramento de Árvores</h1>
            {editing ? (
                <form className="edit-form" onSubmit={handleUpdateSubmit}>
                    <h2>Editar Árvore</h2>
                    <div className="input-field">
                        <input
                            type="text"
                            name="nome_registrante"
                            value={currentTree.nome_registrante}
                            onChange={handleInputChange}
                            placeholder="Nome do Registrante"
                            readOnly
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="nome_cientifico"
                            value={currentTree.nome_cientifico}
                            onChange={handleInputChange}
                            placeholder="Nome Científico da Árvore"
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="date"
                            name="data_plantio"
                            value={currentTree.data_plantio}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-field">
                        <select
                            name="estado_saude"
                            value={currentTree.estado_saude}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Sáude da Árvore</option>
                            <option value="Saudável">Saudável</option>
                            <option value="Doente">Doente</option>
                            <option value="Morrendo">Morrendo</option>
                        </select>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="localizacao"
                            value={currentTree.localizacao}
                            onChange={handleInputChange}
                            placeholder="Localização"
                        />
                    </div>
                    <button className="update" type="submit">Atualizar Árvore</button>
                    <button className="cancel-button" onClick={() => setEditing(false)}>Cancelar</button>
                </form>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuário</th>
                            <th>Nome Científico</th>
                            <th>Data de Plantio</th>
                            <th>Estado de Saúde</th>
                            <th>Localização</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trees.map(tree => (
                            <tr key={tree.id}>
                                <td>{tree.id}</td>
                                <td>{tree.nome_registrante}</td>
                                <td>{tree.nome_cientifico}</td>
                                <td>{formatDate(tree.data_plantio)}</td>
                                <td>{tree.estado_saude}</td>
                                <td>{tree.localizacao}</td>
                                <td>
                                    {tree.usuario_id === user.id || user.id === 1 ? (
                                        <>
                                            <button onClick={() => handleEditClick(tree)}>Editar</button>
                                            <button
                                                className="delete-button" onClick={() => handleDeleteTree(tree.id)} disabled={loadingDelete}
                                            >
                                                {loadingDelete ? "Excluindo..." : "Excluir"}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="readonly-actions">
                                            <FaLock title="Você não pode editar ou excluir esta árvore" style={{ color: 'gray', marginRight: '8px' }} />
                                            <button className="report-button" onClick={() => handleReportClick(tree.id)}>Reportar problema</button>
                                        </div>
                                    )}
                                </td>



                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showReportModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Reportar Problema</h2>
                        <textarea
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            placeholder="Descreva o problema encontrado..."
                        />
                        <div className="modal-actions">
                            <button className="send-button" onClick={handleSendReport} disabled={loading}>
                                {loading ? "Enviando..." : "Enviar"}
                            </button>
                            <button className="cancel-button" onClick={handleCloseModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="success-overlay">
                    <div className="success-message">
                        <h2>✅ {successMessage}</h2>
                        <button onClick={() => setSuccessMessage('')}>Fechar</button>
                    </div>
                </div>
            )}

            {showSuccessDelete && (
                <div className="delete-success-overlay">
                    <div className="delete-success-message">
                        <h2>Árvore deletada com sucesso!</h2>
                        <button onClick={() => setShowSuccessDelete(false)}>Fechar</button>
                    </div>
                </div>

            )}

            {showSuccessEdit && (
                <div className="action-success-overlay">
                    <div className="action-success-message">
                        <h2>Árvore editada com sucesso!</h2>
                        <button onClick={() => setShowSuccessEdit(false)}>Fechar</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Monitoring;