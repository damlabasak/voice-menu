import React from "react";
import "./OrderState.css";
import img from './images/orderState.jpeg';

const OrderState = () => {
  return (
    <div id="orderState">
      <div className="image">
        <img
          src={img}
          alt="order state"
        />
      </div>
    </div>
  );
};

export default OrderState;
