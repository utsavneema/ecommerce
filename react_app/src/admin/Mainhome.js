import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../helpers';
import Loginnavbar from '../Components/Loginnavbar';

const Mainhome = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await axios.post(baseUrl + 'api/login', data);
  
      if (response.data.status) {
        // console.log(response.data);
        localStorage.setItem('authToken', response.data.token);
        setUserDetails(response.data.user);
        if (response.data.user.role === 'User') {
          navigate('/user');
        } else (navigate('/admin/adminpage')); 
      } else {
        setError(response.data.message);
      }
    
    } catch (error) {
      console.error(error);
      setError('Login failed');
    }
  };
  
  return (
    <Loginnavbar>
<div style={{ backgroundColor: '#cbcbcb', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <center>
        <h2>Welcome to Store</h2>
        <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ width: '18rem' }}>
            <Card.Body style={{ backgroundColor: '#001f3f', color: 'white' }}>
              <Card.Title>Welcome to our Store</Card.Title>
              <Card.Subtitle className="mb-2 text-muted" style={{ color: 'white' }}>Please enter the following details to login</Card.Subtitle>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="mt-3"></div>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <div className="mt-3"></div>
                </Form.Group>
                {error && <div className="text-danger">{error}</div>}
                <div className="mt-3"></div>
                <Button variant="success" type="submit" style={{ width: '100%' }}> Sign In </Button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  Don't have an Account? <Link to="/register" style={{ color: 'white' }}>Register</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </center>
    </div>

    </Loginnavbar>
      );
};

export default Mainhome;
