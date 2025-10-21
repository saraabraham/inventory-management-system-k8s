import { useState, useRef, useCallback } from 'react';

export default function useFileUpload() {
    const [file, setFile] = useState(null);
    const ref = useRef(null);

    const handleFileSelect = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('Please select a valid PDF file');
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
        } else {
            alert('Please drop a valid PDF file');
        }
    }, []);

    const handleDragOver = useCallback((e) => e.preventDefault(), []);

    const resetFileInput = useCallback(() => {
        if (ref.current) ref.current.value = '';
        setFile(null);
    }, []);

    return {
        file,
        setFile,
        fileInputRef: ref,
        handleFileSelect,
        handleDrop,
        handleDragOver,
        resetFileInput
    };
}
