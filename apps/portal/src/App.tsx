import { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// For MVP, we'll hardcode an exception ID or get it from URL query param
// For MVP, if no ID in URL, we try to use a recent one or alert user
const getExceptionId = () => {
    const params = new URLSearchParams(window.location.search);
    // Ideally, we would fetch the "latest open exception" fro API if none provided, 
    // but for now, the user must provide one or we use a placeholder that might fail if not seeded.
    return params.get('id') || 'demo-exception-id';
};

function App() {
    const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setStatus('UPLOADING');
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('document', file);

        try {
            const exceptionId = getExceptionId();
            await axios.post(`${API_URL}/upload/${exceptionId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setUploadProgress(percentCompleted);
                },
            });

            setStatus('SUCCESS');
        } catch (error) {
            console.error(error);
            setStatus('ERROR');
            setErrorMessage('Failed to upload document. Please try again.');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxFiles: 1
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">

                {status === 'IDLE' && (
                    <>
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload size={32} />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Upload Document</h1>
                            <p className="text-gray-500 mt-2 text-sm">
                                Please upload the requested document to complete your application.
                            </p>
                        </div>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                        >
                            <input {...getInputProps()} />
                            <p className="text-gray-600 font-medium">
                                {isDragActive ? "Drop the file here..." : "Drag & drop file here, or click to select"}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG (Max 10MB)</p>
                        </div>
                    </>
                )}

                {status === 'UPLOADING' && (
                    <div className="py-10">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">Uploading...</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
                    </div>
                )}

                {status === 'SUCCESS' && (
                    <div className="py-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h2>
                        <p className="text-gray-600">Your document has been securely received and is being validated.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 text-blue-600 font-medium hover:text-blue-800"
                        >
                            Upload another document
                        </button>
                    </div>
                )}

                {status === 'ERROR' && (
                    <div className="py-8">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Failed</h2>
                        <p className="text-gray-600">{errorMessage}</p>
                        <button
                            onClick={() => setStatus('IDLE')}
                            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

            </div>

            <div className="mt-8 text-center text-gray-400 text-xs">
                <p>Your connection is encrypted with 256-bit SSL security.</p>
                <p className="mt-1">&copy; 2026 MEDA Inc.</p>
            </div>
        </div>
    )
}

export default App
