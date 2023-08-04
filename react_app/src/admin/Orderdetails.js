import axios from 'axios';
import { baseUrl } from '../helpers';
import React, { useEffect, useState } from 'react';
import Frontlayout from '../Front/Frontlayout';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Form, InputGroup } from 'react-bootstrap';
import { priceFormat } from '../helpers';
import { useSelector } from 'react-redux';
import { addTotal } from '../redux/slices/orderSlice';

const Orderdetails = () => {
  const [orderList, setOrderList] = useState([]);
  const { id } = useParams();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchOrderList(id);
  }, [id]);

  // const totalQuantity = useSelector((state) => state.order.totalQuantity);
  // const totalPrice = useSelector((state) => state.order.totalAmount);

  // console.log(totalQuantity, totalPrice);

  const fetchOrderList = async (oder_id) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get(baseUrl + 'api/admin/item-details', {
          params: { oder_id },
          headers: {
            Authorization: token,
          },
        });

        const { status, orderList } = response.data;
         console.log(response.data);
        if (status && orderList) {
          setOrderList(orderList);

          let totalQuantity = 0;
          let totalPrice = 0;

          orderList.map((order) => {
            const quantity = parseInt(order.quantity);
            totalQuantity += quantity;
            totalPrice += quantity * order.price;
          });

          setTotalQuantity(totalQuantity);
          setTotalPrice(totalPrice);
          

        } else {
          console.error('Failed to fetch order details', response.data);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

  return (
    <div>
      <Frontlayout>
        <div className="d-flex justify-content-center" style={{ backgroundColor: '#cbcbcb' }}>
          <div style={{ backgroundColor: '#cbcbcb' }}>
            <Row className="justify-content-center">
              {orderList.map((order) => (
                <Col md={4} key={order.variant_id} style={{ marginBottom: '20px' }}>
                  <Card style={{ width: '350px', height: '420px', margin: '50px', backgroundColor:'#cbcbcb' }}>
                    <Col md={12}>
                      <Card.Img
                        className="card-img-top px-3 py-1"
                        src={baseUrl + '/images/' + order.image}
                        style={{ width: '250px', height: '150px', margin: '0 auto' }}
                        alt={order.name}
                      />
                    </Col>
                    
                    <Col md={12}>
                      <Card.Body>
                        <Card.Title>{order.productname}</Card.Title>
                        <Card.Text>{order.description}</Card.Text>
                        <Card.Text>Variant: {order.variant_title}</Card.Text>
                        <Card.Text>Quantity: {order.quantity}</Card.Text>
                        <Card.Text>Price: {priceFormat()}{order.price}</Card.Text>
                      </Card.Body>
                    </Col>
                  </Card>
                </Col>
              ))}
              {/* <div>
                
                <h5>Total Quantity: {totalQuantity}</h5>
                <h5>Total Price</h5>
                <InputGroup className="mb-3">
                  <InputGroup.Text>{priceFormat()}</InputGroup.Text>
                  <Form.Control
                    aria-label="Amount (to the nearest dollar)"
                    value={totalPrice}
                    style={{ maxWidth: '100px' }}
                    readOnly 
                  />
                </InputGroup>
              </div> */}
              <div>
              <h5>Total Quantity: {totalQuantity}</h5>
              <h5>Total Price</h5>
              <InputGroup className="mb-3">
        <InputGroup.Text>{priceFormat()}</InputGroup.Text>
        <Form.Control aria-label="Amount (to the nearest dollar)" value={totalPrice} style={{maxWidth:'100px'}} />
        </InputGroup>
            </div>
            </Row>
            
          </div>
        </div>
      </Frontlayout>
    </div>
  );

};

export default Orderdetails;
