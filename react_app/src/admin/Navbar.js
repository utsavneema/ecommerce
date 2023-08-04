import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navbarr(props) {
  const navigate = useNavigate();
  const dropdownStyle = {
    backgroundColor: '#001f3f',
  };

  const logoClick = () => {
    navigate('/');
  };

  const tagsclick = () => {
    navigate('/admin/tags');
  };
  const categoryClick = () => {
    navigate('/admin/category');
  };
  const homeClick = () => {
    navigate('/admin/home');
  };
  const addProductClick = () => {
    navigate('/admin/product');
  };

  return (
    <div>
      <Navbar expand="lg" className="navbar-dark" style={{ backgroundColor: '#001f3f' }}>
      <Link to="/" onClick={logoClick} style={{ textDecoration: 'none', marginLeft:'1rem', marginRight: '0.5rem' }}>
            <img src="/logo987.png" width="40" height="40" className="d-inline-block align-top" alt="Logo" />
          </Link>
      <Container>

        {/* <Navbar.Brand href="#">Apna Store</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
        
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll>
            <Nav.Link onClick={homeClick} style={{ marginRight: "1rem",marginLeft: '0.5rem' , color: "white" }}>Home</Nav.Link>
            <Nav.Link onClick={addProductClick} style={{ marginRight: "1rem", color: "white" }}>Add Product</Nav.Link>
            <Nav.Link onClick={logoClick} style={{ marginRight: "1rem", color: "white" }}>Products</Nav.Link>

            {/* <NavDropdown title="Product list" id="navbarScrollingDropdown" style={{backgroundColor: '#001f3f'}}>
              <NavDropdown.Item href="/admin/productlist">Product List</NavDropdown.Item>
              <NavDropdown.Item href="/">Products</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/admin/order">
                Your Orders
              </NavDropdown.Item>
            </NavDropdown> */}
            <Nav.Link onClick={tagsclick} style={{ marginRight: "1rem", color: "white" }}>
              Tags
            </Nav.Link>
            <Nav.Link onClick={categoryClick} style={{ marginRight: "1rem", color: "white" }}>
              Category
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
            <Button variant="outline-primary">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      {props.children}
    <div style={{height:50,background:'#001f3f', marginBottom:'0'}} > footer</div>
  </div> 
  );
}

export default Navbarr;

// Navbarr