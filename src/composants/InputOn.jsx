import React from 'react';

export default function InputOn({ type = 'text', width, placeholder, value, onChange }) {
    return (
        <input
            type={type}
            className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
