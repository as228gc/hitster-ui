import React from "react";
import { useNavigate } from "react-router-dom";

const ConfigureTeamsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Navigate back to the Welcome page
  };

  return (
    <div className="container">
      <h1 className="title">Configure Teams</h1>
      <button className="button configure" onClick={handleBack}>
        Back to Welcome
      </button>
      {/* Add team configuration UI here */}
    </div>
  );
};

export default ConfigureTeamsPage;
