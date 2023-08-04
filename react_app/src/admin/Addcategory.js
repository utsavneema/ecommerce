import React, { useState } from 'react'
import Navbarr from './Navbar'
import { baseUrl } from '../helpers';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const Addcategory = () => {
  const navigate = useNavigate();
  const[name, setName] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post(baseUrl+'api/admin/add-category', {
            name: name, 
          });
        console.log("category inserted",response)
        navigate('/admin/category');
      };

      const changeName = (event) => {
        setName(event.target.value);
      };


  return (
    <div>
        <Navbarr>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh', backgroundColor: '#cbcbcb' }}>
        <Card style={{ width: '400px' }}>
          <Card.Header as="h5">Add Category name</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="tagName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control type="text"  value={name} onChange={changeName}/>
              </Form.Group> 
              <Button variant="primary" type="submit" >
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
        </Navbarr>
    </div>
  )
}

export default Addcategory