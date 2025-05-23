// Card.js
import React from 'react';



const Card = ({ children }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            {children}
        </div>
    );
};

export default Card;


