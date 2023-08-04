import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbarr from './Navbar';
import { baseUrl } from '../helpers';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

const Edittags = () => {
  const { id } = useParams();
  const [tagName, setTagName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getTagId();
  }, [id]);

  const getTagId = async () => {
    try {
      const response = await axios.get(baseUrl+'api/admin/site-data', {
        params: { tagId: id }
      });
      if (response.data.status) {
        console.log(response.data);
        const tags = _.get(response, 'data.tags');
        const tag = _.find(tags, { id: parseInt(id) });
        setTagName(_.get(tag, 'name'));
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
      console.log(tagName);
      const response = await axios.put(baseUrl+'api/admin/update-tag', 
      { name: tagName }, {
        params: { tagId: id }
      });
      if (response.data.status) {
        console.log('Tag updated successfully');
        navigate('/admin/tags'); 
      } else {
        console.error('Failed to update tag:', _.get(response, 'data.error'));
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
                  <Form.Label>Provide Tag Name to be Updated</Form.Label>
                  <Form.Control type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} />
                </Form.Group>
                <Button  type="submit"variant="dark">
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

export default Edittags;
