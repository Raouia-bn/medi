import React, { useEffect } from "react";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import IntroContainer from "../containers/home/intro";
import HealthFeatureContainer from "../containers/home/health-feature";
import MedicalFeatureContainer from "../containers/home/medical-feature";
import AppointmentContainer from "../containers/home/appointment";
import TeamContainer from "../containers/home/team";
import TestimonialContainer from "../containers/home/testimonial";
import BrandContainer from "../containers/global/brand";
import PricingContainer from "../containers/global/pricing";
import BlogAccordion from "../containers/home/blog-accordion";
import GoogleMapContainer from "../containers/global/map";
import Footer from "../layouts/footer";
import ScrollToTop from "../components/scroll-to-top";
import SEO from "../components/seo";

const HomePage = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.type = "module";

        
        script.src =
            "https://cdn.jsdelivr.net/npm/@denserai/embed-chat@1/dist/web.min.js";
        script.onload = () => {
            const Chatbot = window.Chatbot;
            if (Chatbot) {
                Chatbot.init({
                    chatbotId: "3427fcf2-dfbd-4a6e-bb52-bb09b7c8c290",
                });
            }
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <React.Fragment>
            <Layout>
                <SEO title="Hope – Health &amp; Medical React JS Template" />
                <div className="wrapper home-default-wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <IntroContainer />
                        <HealthFeatureContainer />
                        <MedicalFeatureContainer />
                        <AppointmentContainer />
                        <TeamContainer />
                        <TestimonialContainer />
                        <BrandContainer />
                        <PricingContainer />
                        <BlogAccordion />
                        <GoogleMapContainer />
                    </div>
                    <Footer />
                    <ScrollToTop />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default HomePage;
