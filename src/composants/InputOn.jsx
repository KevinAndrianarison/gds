import React from 'react';

export default function InputOn({ type = 'text', width, placeholder, value, onChange, onBlur, disabled, height }) {
    return (
        <input
            type={type}
            className={`border-2 rounded p-2 ${width} ${disabled ? 'bg-gray-100 border-none text-gray-500' : 'bg-white border-blue-200'} focus:outline-none ${height}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
        />
    );
}
