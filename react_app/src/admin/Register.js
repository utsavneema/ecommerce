import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loginnavbar from '../Components/Loginnavbar';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('User');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/register', {
        name: name,
        email: email,
        password: password,
        role: role,
      });
      console.log(response.data);
      // alert('User created successfully');
      setRole('User');
      setName('');
      setEmail('');
      setPassword('');
      navigate('/login');
    } catch (error) {
      console.error(error);
      // alert('Failed to create user');
    }
  };

  return (
    <div>
      <Loginnavbar>
        <center>
          <div
            style={{
              backdropFilter: 'blur(5px)',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#cbcbcb',
              flexDirection: 'column', // Add this line to center elements vertically
            }}
          >
            <h4>Please Enter Details to Register</h4>
            <Card style={{ width: '18rem' }}>
              <Card.Body style={{ backgroundColor: '#001f3f', color: 'white' }}>
                <Card.Title>Create Account</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Please enter the following details</Card.Subtitle>
                <Form onSubmit={handleSubmit}>
                  <div className="mt-3"></div>
                  <Form.Group controlId="formName">
                    <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <div className="mt-3"></div>
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="mt-3"></div>
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="mt-3"></div>
                  </Form.Group>
                  <div className="mt-3"></div>
                  <Button variant="dark" type="submit" style={{ width: '100%', color: 'white' }}>
                    Sign Up
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </center>
      </Loginnavbar>
    </div>
  );
};

export default Register;
