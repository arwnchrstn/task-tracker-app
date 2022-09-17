import React from "react";

const ButtonSecondary = (props) => {
  return (
    <button
      className={`btn btn-secondary rounded text-dark ${props.property}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default ButtonSecondary;
