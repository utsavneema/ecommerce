import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import axios from "axios";
import { baseUrl, priceFormat } from "./helpers";
import Frontlayout from "./Front/Frontlayout";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentStatus, setPaymentId } from "./redux/slices/paymentSlice";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const orderId = useSelector((state) => state.payment.orderId);
  const totalAmount = useSelector((state)=> state.payment.totalAmount);
  
  const pay = async () => {
    try {
      const response = await axios.post(baseUrl + "api/pay", {
        totalAmount,
        orderId,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const cardElement = elements.getElement(CardElement);
      const confirmPayment = await stripe.confirmCardPayment(
        response.data.clientSecret,
        { payment_method: { card: cardElement } }
      );
      // const paymentId = response.data.paymentId;
      if (confirmPayment.paymentIntent && confirmPayment.paymentIntent.status === "succeeded") {
        setPaymentSuccessful(true);

        try {
          await axios.put(baseUrl + "api/update-status", {
            orderId: orderId,
            paymentStatus: "success",
          });
          console.log("Payment status updated to 'success'");
        } catch (err) {
          console.error("Error:", err);
        }
      } else {
        setErrorMessage("Payment failed!");

        try {
          await axios.put(baseUrl + "api/update-status", {
            orderId: orderId,
            paymentStatus: "failed",
          });
          console.log("Payment status updated to 'failed'");
        } catch (err) {
          console.error("ErroRR:", err);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("There was an error in payment");
      navigate('/user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setPaymentSuccessful(false);
    await pay();
    navigate('/user');
  };
  
  return (
    <Frontlayout>
      <div style={{ backgroundColor: "#cbcbcb" }}>
        <p> Use this: Number: "4000002760003184",
    MM/YY: 12/25,
    CVC: 123,
    zip:12345</p>
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Amount (in {priceFormat()}):
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Card Details:
            </label>
            <CardElement
              options={{
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              }}
              
            />
          </div>

          {errorMessage && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              {errorMessage}
            </div>
          )}
          {paymentSuccessful ? (
            <div
              style={{
                color: "green",
                marginTop: "10px",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              Payment successful!
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          )}
        </form>
      </div>
    </Frontlayout> 
  );
};

export default PaymentForm;
