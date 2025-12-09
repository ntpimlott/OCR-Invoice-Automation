import React from "react";

type ButtonProps = {
  label: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#4f46e5",
        color: "#fff",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.2s",
      }}
      onClick={onClick}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
    >
      {label}
    </button>
  );
};

export default Button;
