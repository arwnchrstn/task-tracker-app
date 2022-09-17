import React from "react";

const ButtonPrimary = (props) => {
  return (
    <button
      className={`btn btn-primary rounded text-white ${props.property}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default ButtonPrimary;
