// src/components/EncryptionHistory.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import './AltNavBar.css';

function EncryptionHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axiosInstance.get('/history');
                setHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading encryption history:', error);
                setError('Failed to load encryption history');
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const downloadPdf = (base64String, filename) => {
        // Convert base64 string to ArrayBuffer
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the ArrayBuffer
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        // Clean up
        window.URL.revokeObjectURL(link.href);
    };

    if (loading) {
        return (
                <div className="history-container">
                    <h2>Loading encryption history...</h2>
                </div>
        );
    }

    if (error) {
        return (
                <div className="history-container">
                    <h2 className="error-text">{error}</h2>
                </div>
        );
    }

    return (
            <div className="history-container">
                <h2>Encryption History</h2>
                <div className="table-responsive">
                    <table className="history-table">
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Original PDF</th>
                            <th>Result PDF</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(item.date).toLocaleString()}</td>
                                    <td>{item.encryptionMethod}</td>
                                    <td>
                                        <button
                                                className="btn download-btn"
                                                onClick={() =>
                                                        downloadPdf(
                                                                item.originalPdfBase64,
                                                                `original_${index + 1}.pdf`
                                                        )
                                                }
                                        >
                                            Download Original
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                                className="btn download-btn"
                                                onClick={() =>
                                                        downloadPdf(
                                                                item.resultPdfBase64,
                                                                `result_${index + 1}.pdf`
                                                        )
                                                }
                                        >
                                            Download Result
                                        </button>
                                    </td>
                                </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
    );
}

export default EncryptionHistory;
