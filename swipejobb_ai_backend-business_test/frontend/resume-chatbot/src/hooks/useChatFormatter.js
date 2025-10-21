import React from 'react';

export default function useChatFormatter() {
    const formatText = (text) => {
        if (!text) return null;

        const lines = text.split('\n');
        const elements = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            if (line.includes('|') && lines[i + 1]?.includes('---')) {
                const tableLines = [];
                let j = i;
                while (j < lines.length && lines[j].includes('|')) tableLines.push(lines[j++]);

                const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
                const rows = tableLines.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(c => c));

                elements.push(
                    <table key={i} style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                                {headers.map((h, idx) => <th key={idx} style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontWeight: '600' }}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIdx) => (
                                <tr key={rowIdx} style={{ backgroundColor: rowIdx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                    {row.map((cell, cellIdx) => <td key={cellIdx} style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );

                i = j;
                continue;
            }

            if (line.startsWith('### ')) elements.push(<h4 key={i} style={{ fontSize: '16px', fontWeight: '600', margin: '16px 0 8px', color: '#1f2937' }}>{line.replace('### ', '')}</h4>);
            else if (line.startsWith('## ')) elements.push(<h3 key={i} style={{ fontSize: '18px', fontWeight: '700', margin: '20px 0 10px', color: '#111827' }}>{line.replace('## ', '')}</h3>);
            else if (line.trim() !== '') {
                const parts = line.split(/(\*\*.*?\*\*)/g).map((part, idx) =>
                    part.startsWith('**') && part.endsWith('**') ? <strong key={idx}>{part.slice(2, -2)}</strong> : part
                );
                elements.push(<div key={i} style={{ marginBottom: '6px', lineHeight: '1.6' }}>{parts}</div>);
            }

            i++;
        }

        return elements;
    };

    return { formatText };
}
