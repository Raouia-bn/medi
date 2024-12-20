import SocialIcon from "../../components/social-icon";
import Button from "../../components/button";
import Logo from "../../components/logo";
import MainMenu from "../../components/menu/main-menu";
import HomeData from "../../data/home.json";
import HeaderContactInfo from "../../components/header-contact-info";
import { Fragment, useEffect, useState } from "react";
import MobileMenu from "../../components/menu/mobile-menu";
import MenuOverlay from "../../components/menu/menu-overlay";
import { NavLink, useHistory } from "react-router-dom";
import { logoutUser } from "../../api/userApi"; 

const Header = () => {
    const [ofcanvasShow, setOffcanvasShow] = useState(false);
    const [scroll, setScroll] = useState(0);
    const [headerTop, setHeaderTop] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken")); 
    const history = useHistory();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

    const onCanvasHandler = () => {
        setOffcanvasShow((prev) => !prev);
    };

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
        <Fragment>
            <header className="header">
               

              

                <div className="header-bottom d-none d-lg-block">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <MainMenu />
                                  
                                    <ul className="main-menu">
                                        <li className="main-menu-link">
                                            {isLoggedIn ? (
                                                <>
                                                    {/* Affichage du nom de l'utilisateur */}
                                                    <NavLink 
                                                        className="main-menu-link" 
                                                        to="" 
                                                        aria-label="User Profile"
                                                    >
                                                        <span>{user.user.name}</span>
                                                    </NavLink>

                                                    {/* Lien pour se déconnecter */}
                                                    <NavLink 
                                                        className="main-menu-link" 
                                                        onClick={handleLogout} 
                                                        to="" 
                                                        aria-label="Logout"
                                                    >
                                                        Logout
                                                    </NavLink>
                                                    
                                                </>
                                            ) : (
                                                <NavLink className="main-menu-link" exact to="/login">
                                                    Login
                                                </NavLink>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`header-bottom sticky-header d-none d-lg-block ${
                        scroll > headerTop ? "sticky" : ""
                    }`}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <MainMenu />
                                    <Button
                                        path={process.env.PUBLIC_URL + "/"}
                                        classOption="book-now-btn"
                                        text="book an appointment"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MenuOverlay show={ofcanvasShow} />
            <MobileMenu show={ofcanvasShow} onClose={onCanvasHandler} />
        </Fragment>
    );
};

export default Header;
