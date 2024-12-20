import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/index";
import "./assets/css/bootstrap.min.css";
import "./assets/scss/style.scss";
import "./assets/css/icofont.css";
import "swiper/components/navigation/navigation.scss";
import "swiper/swiper.scss";
import "./assets/css/animate.css";
import "lightgallery.js/dist/css/lightgallery.css";
import "swiper/components/pagination/pagination.scss";
import AboutPage from "./pages/about";
import ServicePage from "./pages/service";
import ServiceDetails from "./templates/service-details";
import BlogPage from "./pages/blog";
import BlogDetailsPage from "./templates/blog-details";
import BlogCategory from "./templates/blog-category";
import BlogTag from "./templates/blog-tag";
import BlogDate from "./templates/blog-date";
import BlogAuthor from "./templates/blog-author";
import ContactPage from "./pages/contact";
import NavScrollTop from "./components/nav-scroll-top";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DoctorListPage from "./pages/DoctorListPage"; // Importation de la page de la liste des docteurs
import DoctorPlanningPage from "./pages/doctorPlanning"; // Importation de la page de planning
import PharmacyOrdonancePage from "./pages/pharmacyOrdonance"; // Importation de la page de planning
import PharmacyOrdonanceAcceptPage from "./pages/PharmacyOrdonanceAcceptPage"; // Importation de la page de planning
const App = () => {
    useEffect(() => {
        AOS.init({
            offset: 80,
            duration: 1000,
            once: true,
            easing: "ease",
        });
        AOS.refresh();
    }, []);

    return (
        <Router>
            <NavScrollTop>
                <Switch>
                    {/* Routes existantes */}
                    <Route
                        path={`${process.env.PUBLIC_URL + "/"}`}
                        exact
                        component={HomePage}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/about"}`}
                        component={AboutPage}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/service"}`}
                        component={ServicePage}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/service-details/:id"}`}
                        component={ServiceDetails}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/blog"}`}
                        component={BlogPage}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/category/:slug"}`}
                        component={BlogCategory}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/tag/:slug"}`}
                        component={BlogTag}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/date/:date"}`}
                        component={BlogDate}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/author/:author"}`}
                        component={BlogAuthor}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/blog-details/:id"}`}
                        component={BlogDetailsPage}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/contact"}`}
                        component={ContactPage}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/login"}`}
                        component={LoginPage}
                    />
                    <Route
                        path={`${process.env.PUBLIC_URL + "/register"}`}
                        component={RegisterPage}
                    />

                    {/* Utilisez ProtectedRoute pour la liste des docteurs */}
                    <Route path={`${process.env.PUBLIC_URL + "/doctors"}`} component={DoctorListPage} />
                      {/* Utilisez ProtectedRoute pour la liste des docteurs */}
                      <Route path={`${process.env.PUBLIC_URL + "/planningDoctor"}`} component={DoctorPlanningPage} />
                      <Route path={`${process.env.PUBLIC_URL + "/PharmacyOrdonance"}`} component={PharmacyOrdonancePage} />
                      <Route path={`${process.env.PUBLIC_URL + "/MyOrdonance"}`} component={PharmacyOrdonanceAcceptPage} />
                </Switch>
            </NavScrollTop>
        </Router>
    );
};

export default App;
