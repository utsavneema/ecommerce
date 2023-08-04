import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Frontlayout from '../Front/Frontlayout';
import { baseUrl } from '../helpers';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Adminpage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    getUserDetail();
    fetchAllOrders();
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

  const completeOrder = async (order_id) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
      //   console.log("order_id:", order_id); 
      // console.log("Request data:", { oder_id: order_id, Authorization: token });
        const response = await axios.put(baseUrl + 'api/complete-order',
          { oder_id: order_id }, 
          {
            headers: {
              Authorization: token,
            },
          }
        );
  
        if (response.data.status) {
          // console.log(response.data.status, "----------------------------------------");
          const updatedallOrders = allOrders.map((order) =>
            order.oder_id === order_id ? { ...order, status: 'completed' } : order
          );
          setAllOrders(updatedallOrders);
        } else {
          console.error('Failed to complete order', response.data);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(baseUrl + 'api/all-orders');
      const { status, allOrders } = response.data;
      console.log(response.data);

      if (status && allOrders) {
        setAllOrders(allOrders);
        

      } else {
        console.error('Failed to fetch all orders', response.data);
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  const orderDetail = (oder_id) => {
    navigate(`/admin/order-details/${oder_id}`);
  };
  
  return (
    <div>
      <Frontlayout>
        {userDetails && (
          <div style={{ backgroundColor: "#cbcbcb" }}>
            <div className='container'>
              <div className='row d-flex justify-content-center'>
                <div className='col'>
                  <h3 className="text-center" style={{ marginTop: "20px" }}>Welcome, Admin</h3>
                </div>
              </div>
            </div>
            
            <strong><h6 style={{ marginLeft: '1rem' }}>You logged in using id:</h6></strong>
            <h7 style={{ marginLeft: '1rem' }}>Email: {userDetails.email}</h7>
            <div>
              <h4 className="text-center">All Orders</h4>
              <Table striped bordered hover className='container'>
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Name of User</th>
                    <th>Placed on</th>
                    {/* <th>Product Name</th>
                    <th>Image</th>
                    <th>Total Amount</th> */}
                    <th>Order Details</th>
                    <th>Status</th>
                    <th>Complete Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order, index) => (
                    <tr key={order.oder_id}>
                      <td>{index + 1}</td>
                      <td>{order.username}</td>
                      <td>{order.placed_on}</td>
                      {/* <td>{order.productname}</td>
                      <td>
                        <img
                          className="card-img"
                          src={baseUrl + '/images/' + order.image}
                          style={{ width: '50px', height: '50px' }}
                          alt="Product"
                        />
                      </td>
                      <td>
                        {order.price * order.quantity}
                      </td> */}
                      <td> <Button variant = 'dark' onClick={() => orderDetail(order.oder_id)}>Order Details</Button></td>
                      <td>{order.status}</td>
                      <td>
                        {order.status === 'pending' && (
                          <Button variant='dark' onClick={() => completeOrder(order.oder_id)}>
                            Complete Order
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Frontlayout>
    </div>
  );
};

export default Adminpage;
