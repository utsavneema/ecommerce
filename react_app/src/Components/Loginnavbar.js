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
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" style={{ textDecoration: 'none', marginRight: '1rem', marginLeft: "1rem", marginTop: "0.5rem", color: "white" }}>
                Products
              </Link>
              <Nav.Link onClick={handleDashboardClick} style={{ marginRight: "52rem", color: "white" }}>
                Dashboard
              </Nav.Link>
              <span style={{ display: "flex", alignItems: "center" }}>
                <Button style={{ width: "3rem", height: "3rem" }} variant="outline-light" className="rounded-circle" onClick={cartClick}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Button>
                <span style={{ marginLeft: "-10px", backgroundColor: "green", color: "white", borderRadius: "50%", padding: "4px", fontSize: "12px", minWidth: "20px", textAlign: "center", marginRight: "15px" }}>{items.length}</span>
              </span>
              <Form className="d-flex">
                <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
                <Button variant="outline-info">Search</Button>
              </Form>
              <Nav.Link href="/login" style={{ color: "white" }}>Login</Nav.Link>
              {tokenPresent() &&
                (
                  <Nav.Link onClick={handleLogout} style={{ color: "white" }}>
                    Logout
                  </Nav.Link>
                )}
            </Nav>
          </Navbar.Collapse> */}
        </Container>
      </Navbar>
      {props.children}
      <div style={{ height: 40, background: '#001f3f', marginBottom: '0' }} > footer</div>
    </div>
  );
};

export default Loginnavbar;
