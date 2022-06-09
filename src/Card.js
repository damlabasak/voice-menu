import React from "react";
import "./Card.css";

const Card = ({ price, image, specialName }) => {
  return (
    <div className="card">
      <div className="card__image">
        <img
          src={image}
        />
      </div>
      <div className="productDet">
        <div className="card__details">
          <p className="title">{specialName}</p>
          <span className="span1">₺{price}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
