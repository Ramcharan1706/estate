// src/components/PropertyList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PropertyList = () => {
    interface Property {
        id: number;
        name: string;
        // Add other fields as necessary
    }

    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Replace with your backend API URL
                const response = await axios.get('http://localhost:5000/api/properties');
                setProperties(response.data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div>
            <h2>Available Properties</h2>
            <ul>
                {properties.map(property => (
                    <li key={property.id}>
                        <Link to={`/property/${property.id}`}>{property.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PropertyList;
