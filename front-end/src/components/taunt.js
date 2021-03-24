import React from "react";
import tbg from "../images/happy-family.jpg";
import AuthenticationButton from "./authentication-button";

const Taunt = () => (
    <div className="text-center" style={{
        backgroundImage: `url(${tbg})`,
        height: '50vh',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity: '0.9',
        color: 'whitesmoke',
        textShadow: '1px 1px black'
    }}>
        <div style={{
            paddingTop: '16vh'
        }}>
            <h2>Not convinced?</h2>
            <h2>Sign up now and secure your financial future, it's free!</h2>
            <div style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto',
                paddingTop: '1rem'
                }}>
                <AuthenticationButton />
            </div>
        </div>
    </div>
);

export default Taunt;