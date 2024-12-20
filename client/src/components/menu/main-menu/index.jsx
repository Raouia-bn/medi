import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { logoutUser } from "../../../api/userApi"; 

const MainMenu = () => {
    const [scroll, setScroll] = useState(0);
    const [headerTop, setHeaderTop] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken")); 
    const history = useHistory();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

    useEffect(() => {
        const header = document.querySelector(".sticky-header");
        setHeaderTop(header.offsetTop);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScroll = () => {
        setScroll(window.scrollY);
    };

    const handleLogout = async () => {
        try {
            await logoutUser(); 
            localStorage.removeItem("authToken"); 
            localStorage.removeItem("user"); 

            setIsLoggedIn(false); 
            history.push("/login"); 
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            alert(error.response ? error.response.data.message : "Une erreur est survenue lors de la déconnexion.");
        }
    };

    return (
        <nav>
            <ul className="main-menu">
                <li className="active">
                    <NavLink className="main-menu-link" exact to="/">
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className="main-menu-link"
                        to={process.env.PUBLIC_URL + "/service"}
                    >
                        Services
                    </NavLink>
                    <ul className="sub-menu">
                        <li>
                            <NavLink
                                className="sub-menu-link"
                                to={process.env.PUBLIC_URL + "/service"}
                            >
                                Services
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="sub-menu-link"
                                to={process.env.PUBLIC_URL + "/service-details/1"}
                            >
                                Service Details
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <NavLink
                        className="main-menu-link"
                        to={process.env.PUBLIC_URL + "/blog"}
                    >
                        Blog
                    </NavLink>
                    <ul className="sub-menu">
                        <li>
                            <NavLink
                                className="sub-menu-link"
                                to={process.env.PUBLIC_URL + "/blog"}
                            >
                                Blog list
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="sub-menu-link"
                                to={process.env.PUBLIC_URL + "/blog-details/1"}
                            >
                                Blog Details
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <NavLink
                        className="main-menu-link"
                        to={process.env.PUBLIC_URL + "/about"}
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className="main-menu-link"
                        to={process.env.PUBLIC_URL + "/contact"}
                    >
                        Contact
                    </NavLink>
                </li>
              
                {/* Si l'utilisateur est connecté et a le rôle Patient, on affiche le lien "Doctors" */}
                {isLoggedIn && user.user.role === 'Patient' && (
                    <li>
                        <NavLink 
                            className="main-menu-link" 
                            to={process.env.PUBLIC_URL + "/doctors"}
                            aria-label="Doctors"
                        >
                            Doctors
                        </NavLink>
                    </li>
                )}
                 {/* Si l'utilisateur est connecté et a le rôle Patient, on affiche le lien "Doctors" */}
                 {isLoggedIn && user.user.role === 'Doctor' && (
                    <li>
                        <NavLink 
                            className="main-menu-link" 
                            to={process.env.PUBLIC_URL + "planningDoctor"}
                            aria-label="Planning"
                        >
                            Planning
                        </NavLink>
                    </li>
                )}
                 {isLoggedIn && user.user.role === 'Pharmacy' && (
                    <li>
                 <NavLink
                        className="main-menu-link"
                        to={process.env.PUBLIC_URL + "/PharmacyOrdonance"}
                    >
                        Prescription
                    </NavLink>
                    <ul className="sub-menu">
                        <li>
                            <NavLink
                                className="sub-menu-link"
                                to={process.env.PUBLIC_URL + "/PharmacyOrdonance"}
                            >
                             Prescription
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="sub-menu-link"
                                to={process.env.PUBLIC_URL + "/MyOrdonance"}
                            >
                                My Prescription
                            </NavLink>
                        </li>
                    </ul>
                
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default MainMenu;
