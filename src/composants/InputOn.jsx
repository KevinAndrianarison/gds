import React from 'react';

export default function InputOn({ width, placeholder }) {
    return (
        <input
            type="text"
            className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
            placeholder={placeholder}
        />
    );
}
