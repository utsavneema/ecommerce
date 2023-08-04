import React, { useState } from 'react'
import Navbarr from './Navbar'
import { baseUrl } from '../helpers';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';


const Addtags = () => {
    const navigate = useNavigate();
    const[name, setName] = useState([]);

    const handleSubmitData = async (event) => {
        event.preventDefault();
        const response = await axios.post( baseUrl+'api/admin/add-tag', {
            name: name, 
          });
        console.log("tag inserted",response)
        navigate('/admin/tags');
      };

      const handleChangeName = (event) => {
        setName(event.target.value);
      };

    return (
      <Navbarr>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh', backgroundColor: '#cbcbcb' }}>
        <Card style={{ width: '400px' }}>
          <Card.Header as="h5">Add your Tags</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmitData}>
              <Form.Group className="mb-3" controlId="tagName">
                <Form.Label>Tag Name</Form.Label>
                <Form.Control type="text" value={name} onChange={handleChangeName} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Navbarr>

    )
}
export default Addtags
//value={name} onChange={handleChangeName}

