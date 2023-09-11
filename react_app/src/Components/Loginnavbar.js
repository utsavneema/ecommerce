import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tokenPresent } from '../helpers';
import { Container, Navbar, Nav, Button, Form } from 'react-bootstrap';

const Loginnavbar = (props) => {
  const items = useSelector((state) => state.cart.items);
  const navigate = useNavigate();


  const logoClick = () => {
    navigate('/');
  };



  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary pb-0" style={{ backgroundColor: "#cbcbcb" }}>
        <Container fluid className='navbar-dark' style={{ backgroundColor: '#001f3f' }}>
          <Link to="/" onClick={logoClick} style={{ textDecoration: 'none' }}>
            <img src="/logo987.png" width="40" height="40" className="d-inline-block align-top" alt="Logo" />
          </Link>
          
        </Container>
      </Navbar>
      {props.children}
      <div style={{ height: 40, background: '#001f3f', marginBottom: '0' }} > footer</div>
    </div>
  );
};

export default Loginnavbar;
