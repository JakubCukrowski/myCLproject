import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faFacebook, faTwitter, faInstagram} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {

    return (
        <footer className="footer-container">
            <div className={"social-media-txt"}>
                Odwiedź nas na: 
            </div>
            <div className="social-media-container">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon fontSize={40} icon={faFacebook} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                    <img className="ig-logo" src={require("../footer/images/174855.png")} alt="ig"/>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon fontSize={40} icon={faTwitter}/>
                </a>
            </div>
            <p className="copyright">
                <strong>Copyright &#169; </strong>
                2022 Dev2Love. All rights reserved
            </p>
        </footer>
    )
}

export default Footer