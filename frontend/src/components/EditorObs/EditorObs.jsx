import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const EditorObservacoes = () => {
    const [valor, setValor] = useState('');
    const quillRef = useRef(null);

    useEffect(() => {
        // Exemplo de como acessar o editor sem usar findDOMNode
        if (quillRef.current) {
            const editor = quillRef.current.getEditor(); // pega a instância do Quill
            console.log(editor);
        }
    }, []);

    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ align: [] }],
            ['bold', 'italic', 'strike'],
            [{ color: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
        ],
    };

    const formats = [
        'font',
        'size',
        'align',
        'bold',
        'italic',
        'strike',
        'color',
        'list',
    ];

    return (
        <ReactQuill
            ref={quillRef}
            theme="snow"
            value={valor}
            onChange={setValor}
            modules={modules}
            formats={formats}
        />
    );
};
