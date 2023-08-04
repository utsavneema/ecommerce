import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { baseUrl } from "../helpers";
import { Row, Col, Card, Button } from "react-bootstrap";
import Frontlayout from "./Frontlayout";
import { priceFormat } from "../helpers";
import { decreaseCart, increaseCart, resetCart } from "../redux/slices/cartSlice";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../paymentForm";
import { setOrderId, setTotalAmount, setPaymentId, setPaymentStatus } from "../redux/slices/paymentSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  // const paymentId = useSelector((state)=> state.payment.paymentId)
  // console.log(paymentId);
  // const paymentStatus = useSelector((state)=> state.payment.paymentStatus);
  // console.log(paymentStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("pending")

  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const orderData = {
          name: name,
          email: email,
          address: address,
          items: cartItems,
          status: status,
          // paymentId:paymentId,
          // paymentStatus: paymentStatus,
        };
        const response = await axios.post(baseUrl + "api/order-details", orderData, {
          headers: {
            Authorization: token, 
          },
        });

        const { orderId } = response.data;
        // console.log((orderId));
      dispatch(setOrderId(orderId));
        // console.log("order placed", response);
        navigate('/paymentform')
        // dispatch(resetCart());

        
      } catch (error) {
        console.error("Error placing order:", error);
      }
    } else {
      setShowLoginMessage(true, "Please, log in first");
      setTimeout(() => {
        setShowLoginMessage(false);
        navigate("/login");
      }, 2000); 
    }
  };
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  dispatch(setTotalAmount(totalAmount))

  return (
    <Frontlayout>
      <Row style={{ backgroundColor: '#cbcbcb' }}>
        <Col sm={8}>
          <div >
            <h3
              className="container"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              Shopping cart
            </h3>
            {cartItems.length === 0 ? (
              <div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div
                    key={item.variantId}
                    style={{
                      marginBottom: "20px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  >
                    <Row className="align-items-center">
                      <Col sm={4}>
                        <img
                          src={baseUrl + "/images/" + item.productImage}
                          alt="Product Image"
                          style={{ width: "auto", height: "auto" }}
                        />
                      </Col>
                      <Col sm={8}>
                        <b>Product Name: {item.productName}</b>
                        <p>Description: {item.description}</p>
                        <p>Variant: {item.name}</p>
                        <div>
                          Price: {priceFormat()} {item.price}
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              border: "1px dark",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              dispatch(
                                decreaseCart({ variantId: item.variantId })
                              )
                            }
                          >
                            -
                          </div>
                          <div style={{ margin: "0 10px" }}>
                            {item.quantity}
                          </div>
                          <div
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              dispatch(
                                increaseCart({ variantId: item.variantId })
                              )
                            }
                          >
                            +
                          </div>
                        </div>
                        <p>Quantity: {item.quantity}</p>
                        {/* <div>
                          Subtotal: {priceFormat()} {item.price * item.quantity}
                        </div> */}
                      </Col>
                    </Row>
                  </div>
                ))}
                {/* <button>Clear cart</button> */}
                <br></br>
                {/* <div>
                  <span>
                    Total Amount: {priceFormat()}
                    {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
                  </span>
                </div> */}
              </div>
            )}
          </div>
        </Col>
        <Col sm={4}>
          <h3>Please Enter Details to place Order</h3>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Your Bill Amount:</Form.Label>
              <Form.Control type="number" value={totalAmount} readOnly />
              {showLoginMessage && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                Please log in to place an order.
              </div>
            )}
            </Form.Group>
            <Button
              variant="dark"
              onClick={handlePlaceOrder}
              style={{ marginBottom: "10px" }}
            >
              Place Order
            </Button>
          </Form>
        </Col>
      </Row>
    </Frontlayout>
  );
};

export default Cart;
