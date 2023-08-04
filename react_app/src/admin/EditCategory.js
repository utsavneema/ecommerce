import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbarr from './Navbar';
import { baseUrl } from '../helpers';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

const EditCategory = () => {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCategoryId();
  }, [id]);

  const getCategoryId = async () => {
    try {
      const response = await axios.get(baseUrl+'api/admin/site-data', {
        params: { categoryId: id }
      });
      console.log(response.data)
      if (response.data.status) {
      const categoryData = _.get(response, 'data.categorylist');
      const categoryName = _.get(categoryData.find(category => category.id === parseInt(id)), 'name', '');
      setCategoryName(categoryName);
      } else {
        console.error('Failed to get details', _.get(response, 'data.error'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(categoryName);
      const response = await axios.put(baseUrl+'api/admin/update-category', 
      { name: categoryName }, {
        params: { categoryId: id }
      });
      if (response.data.status) {
        console.log('Category updated successfully');
        navigate('/admin/category'); 
      } else {
        console.error('Failed to update:', _.get(response, 'data.error'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbarr>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh', backgroundColor: '#cbcbcb' }}>
          <Card style={{ width: '400px' }}>
            <Card.Header as="h5">Update your Tags</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="tagName">
                  <Form.Label>Provide Category Name to be Updated</Form.Label>
                  <Form.Control type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                </Form.Group>
                <Button variant="dark" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Navbarr>
    </div>
  );
};

export default EditCategory