// components/EncryptionHistory.js
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';
import axiosInstance from './axiosInstance';

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

    if (loading) {
        return (
                <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Loading encryption history...
                    </Typography>
                </Container>
        );
    }

    if (error) {
        return (
                <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                    <Typography
                            variant="h5"
                            align="center"
                            color="error"
                            gutterBottom
                    >
                        {error}
                    </Typography>
                </Container>
        );
    }

    return (
            <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Encryption History
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="encryption history table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Method</TableCell>
                                <TableCell>Original PDF</TableCell>
                                <TableCell>Result PDF</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {new Date(item.date).toLocaleString()}
                                        </TableCell>
                                        <TableCell>{item.encryptionMethod}</TableCell>
                                        <TableCell>
                                            <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() =>
                                                            downloadPdf(
                                                                    item.originalPdfBase64,
                                                                    `original_${index + 1}.pdf`
                                                            )
                                                    }
                                            >
                                                Download Original
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() =>
                                                            downloadPdf(
                                                                    item.resultPdfBase64,
                                                                    `result_${index + 1}.pdf`
                                                            )
                                                    }
                                            >
                                                Download Result
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
    );
}

// Function to handle PDF download
function downloadPdf(base64String, filename) {
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
}

export default EncryptionHistory;
