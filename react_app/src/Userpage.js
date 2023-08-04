import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Frontlayout from './Front/Frontlayout';
import { baseUrl } from './helpers';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const Userpage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paymentStatus = useSelector(state => state.payment.paymentStatus)
  const orderId = useSelector((state) => state.payment.orderId);
  const paymentId = useSelector((state)=> state.payment.paymentId);
  // console.log(paymentId);
  // console.log(orderId);

  useEffect(() => {
    getUserDetail();
    fetchOrderList();
  }, []);

  const getUserDetail = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get(baseUrl + 'api/auth', {
          headers: {
            Authorization: token,
          },
        });

        const { status, userDetails } = response.data;
        // console.log(response.data);
        if (status && userDetails) {
          setUserDetails(userDetails);
        } else {
          console.error('Failed', response.data);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  };
  
  const fetchOrderList = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get(baseUrl + 'api/order-list', {
          headers: {
            Authorization: token,
          },
        });

        const { status, orderList } = response.data;
        console.log(response.data);
        if (status && orderList) {
          setOrderList(orderList);
        } else {
          console.error('Failed to fetch order list', response.data);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

  const cancelOrder = async (order_id) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.put(
          baseUrl + 'api/cancel-order',{ oder_id: order_id }, 
          {
            headers: {
              Authorization: token,
            },
          }
        );
  
        if (response.data.status) {
          // console.log(response.data.status, "----------------------------------------");
          const updatedOrderList = orderList.map((order) =>
            order.oder_id === order_id ? { ...order, status: 'cancelled' } : order 
          );
          setOrderList(updatedOrderList);
        } else {
          console.error('Failed to cancel order', response.data);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  };
  
  const cardDetail = (oder_id) => {
    navigate(`/order-detail/${oder_id}`);
  };

  return (
    <div>
      <Frontlayout>
        {userDetails && (
          <div style={{ backgroundColor: '#cbcbcb' }}>
            <div className='container'>
              <div className='row d-flex justify-content-center'>
                <div className='col'>
                  <h3 className="text-center" style={{ marginTop: "20px" }}>Welcome, {userDetails.name}!</h3>
                </div>
              </div>
            </div>
            <strong><h6 style={{ marginLeft: '1rem' }}>You logged in using id:</h6></strong>
            <h7 style={{ marginLeft: '1rem' }}>Email: {userDetails.email}</h7>
            <h4 className="text-center">Order Details</h4>
            <Table striped bordered hover className='container'>
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Placed on</th>
                  {/* <th>Product Name</th>
                  <th>Image</th>
                  <th>Price</th> */}
                  <th>Details</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Cancel Your Order</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order, index)=>(
                  <tr key = {order.oder_id}>
                      <td>{index+1}</td>
                      <td>{order.created_at}</td>
                      {/* <td>{order.name}</td>
                      <td><img src={baseUrl + "/images/" + order.image} style={{ width: '50px', height: '50px' }}/></td>
                      <td>{order.price}</td> */}
                      <td><Button variant='dark' onClick={() => cardDetail(order.oder_id)}>Order Details</Button></td>
                      <td>{order.payment_status}</td>
                      <td>{order.status}</td>
                      <td>
                        {order.status === 'pending' && (
                         <Button variant='dark' onClick={() => cancelOrder(order.oder_id)}> Cancel Order
                          </Button>
                        )}
                         {/* {order.status === 'fail' && ( 
        <Button
          variant='dark'
          onClick={() => getPaymentStatus(order.orderId)}
        >
          Retry Payment
        </Button>
      )} */}
                      </td>
                  </tr>
                ))
                }
              </tbody>
            </Table>
          </div>
        )}
      </Frontlayout>
    </div>
  );

}

export default Userpage;
