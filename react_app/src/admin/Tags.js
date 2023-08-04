import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import Navbarr from './Navbar';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { baseUrl } from '../helpers';

const Tags = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags();
  }, []);

  const getTags = async () => {
    try {
      const response = await axios.get(baseUrl+'api/admin/site-data');
      if (response.data.status) {
        setTags(_.get(response, 'data.tags'));
      } else {
        console.error('Failed to fetch tags:', _.get(response, 'data.error'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const AddTags = () => {
    navigate('/admin/addtags');
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(baseUrl+'api/admin/delete-tag', {
        params: { tagId: id }
      });
      if (response.data.status) {
        console.log('Tag deleted successfully');
        getTags();
      } else {
        console.error('Failed to update tag:', _.get(response, 'data.error'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbarr>
      <div className="container">
        <h4 className="d-flex justify-content-between align-items-end">
          Add Tags
          <Button variant="dark" size="xl" onClick={AddTags} style={{marginTop: "10px"}}>
          <i class="fa fa-plus" aria-hidden="true"></i>
          </Button>
        </h4>
        <div className="container">
          <h4>Tag List</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Tag Name</th>
                <th>Update tag</th>
                <th>Delete tag</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag, index) => (
                <tr key={tag._id}>
                  <td>{index + 1}</td>
                  <td>{tag.name}</td>
                  <td>
                    <Button variant="dark" size="sm" onClick={() => navigate(`/admin/edittags/${tag.id}`)}>
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(tag.id)}>
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Navbarr>
  );
};

export default Tags;
