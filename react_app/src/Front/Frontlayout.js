import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserDetails } from '../redux/slices/userSlice';
import { resetCart } from '../redux/slices/cartSlice';

const Frontlayout = (props) => {
  const items = useSelector((state) => state.cart.items);
  const userDetails = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserDetail = async () => {
      const userDetails = await dispatch(getUserDetails());
      // console.log(userDetails);
    };

    fetchUserDetail();
  }, [dispatch]);

  const cartClick = () => {
    navigate('/front/cart');
  };
 
  const logoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(resetCart());
    navigate('/login');
  };

  const dashboardClick = () => {
    if (userDetails && userDetails.role === 'Admin') {
      navigate('/admin/adminpage');
    } else {
      navigate('/user');
    }
  };

  const productListClick = (event) => {
    if (userDetails && userDetails.role === 'Admin') {
      navigate('/admin/productlist');
    }
  };

  const productsClick = () => {
    if (userDetails) {navigate('/');}
  };  

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary pb-0" style={{ backgroundColor: "#cbcbcb" }}>
        <Container fluid className='navbar-dark' style={{ backgroundColor: '#001f3f' }}>
          <Link to="/"  style={{ textDecoration: 'none' }}>
            <img src="/logo987.png" width="40" height="40" className="d-inline-block align-top" alt="Logo" />
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userDetails && userDetails.role === 'Admin' && (
                <>
                 <Nav.Link onClick={productsClick} style={{ marginRight: "1rem",marginLeft:"1rem", color: "white" }}>
                   Products
                 </Nav.Link>
                  <Nav.Link onClick={dashboardClick} style={{ marginRight: "1rem", color: "white" }}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={productListClick} style={{ marginRight: "1rem", color: "white" }}>
                    Product List
                  </Nav.Link>
                </>
              )}

              {userDetails && userDetails.role === 'User' && (
                 <>
                 <Nav.Link onClick={productsClick} style={{ marginRight: "1rem",marginLeft:"1rem", color: "white" }}>
                   Products
                 </Nav.Link>
                 <Nav.Link onClick={dashboardClick} style={{ marginRight: "1rem", color: "white" }}>
                   Dashboard
                 </Nav.Link>
               </>
              )}
            </Nav>
            <Form className="d-flex ms-auto">
              <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" style={{ marginTop: "10px", marginBottom: "10px" }} />
              <Button variant="outline-info" style={{ marginTop: "10px", marginBottom: "10px" }}>Search</Button>
            </Form>
            <Nav className="me-2">
      <span style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>
        <Button style={{ width: "3rem", height: "3rem" }} variant="outline-light" className="rounded-circle" onClick={cartClick}>
          <i className="fa fa-shopping-cart" aria-hidden="true"></i> 
        </Button>
        <span style={{ marginLeft: "-10px", backgroundColor: "green", color: "white", borderRadius: "50%", padding: "4px", fontSize: "12px", minWidth: "20px", textAlign: "center", marginRight: "15px" }}>{items.length}</span>
      </span>
    </Nav>
            
            <Nav className="me-2">
              {!userDetails && (
                <Nav.Link href="/login" style={{ color: "white" }}>Login</Nav.Link>
              )}

              {userDetails && (
                <Nav.Link onClick={handleLogout} style={{ color: "white" }}>
                  Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {props.children}
      <div style={{ height: 40, background: '#001f3f', marginBottom: '0' }} > footer</div>
    </div>
  );
};

export default Frontlayout;
