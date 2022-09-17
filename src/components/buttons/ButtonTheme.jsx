import React from "react";

const ButtonTheme = (props) => {
  return (
    <button
      className={`btn btn-theme rounded text-dark ${props.property}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default ButtonTheme;
