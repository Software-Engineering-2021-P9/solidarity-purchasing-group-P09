import React from "react";
import { Link } from "react-router-dom";
import "./AskToRegister.css";
function AskToRegister() {
  return (
    <p className="register-message">
      If you do not have account already, you can click here to{" "}
      <Link to="/client/signup" className="register-link">
        register
      </Link>
      !
    </p>
  );
}

export { AskToRegister };
