import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getDoctors } from '../../api/userApi'; // API call to fetch doctors
import DoctorItem from './DoctorItem';
import '../../assets/css/DoctorList.css';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchDoctors = async () => {
            try {
                const response = await getDoctors();
                const data = response.data || response;

                const doctorsList = Array.isArray(data) ? data : data.doctors || [];
                
                if (isMounted) { 
                    setDoctors(doctorsList);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError('Error fetching doctors');
                    setLoading(false);
                }
            }
        };

        fetchDoctors();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredDoctors = doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="doctor-list">
            <input
                type="text"
                placeholder="Search by specialty or address"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            {loading ? (
                <p>Loading doctors...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : filteredDoctors.length === 0 ? (
                <p>No doctors found</p>
            ) : (
                <div className="doctor-items">
                    {filteredDoctors.map((doctor) => (
                        <DoctorItem key={doctor._id} doctor={doctor} />
                    ))}
                </div>
            )}
        </div>
    );
};

DoctorList.propTypes = {
    doctors: PropTypes.array,
};

export default DoctorList;
