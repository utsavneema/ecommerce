import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { baseUrl } from '../helpers';
import axios from 'axios';
import Navbarr from './Navbar';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

const Category = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);

    useEffect(()=>{
      getCategory();
    }, []);

    const addCategory = () => {
        navigate('/admin/add-category');
      };


      const getCategory = async () => {
        try {
          const response = await axios.get(baseUrl + 'api/admin/site-data');
          if (response.data.status) {
            setCategory(_.get(response, 'data.categorylist'));
          } else {
            console.error('Failed to get category list:', _.get(response, 'data.error'));
          }
        } catch (error) {
          console.log(error);
        }
      };
      

    const handleDelete = async (id) => {
      try {
        const response = await axios.delete(baseUrl + 'api/admin/delete-category', {
          params: { categoryId: id }
        });
        if (response.data.status) {
          console.log('category deleted successfully');
          getCategory();
        } else {
          console.error('Failed to update:', _.get(response, 'data.error'));
        }
      } catch (error) {
        console.log(error);
      }
    };

    
  return (
    <div>
        <Navbarr className = 'container'>
        <h4 className=" container d-flex justify-content-between align-items-end">
           Add Category
           <Button variant="dark" size="xxl" onClick={addCategory} style = {{marginTop: "10px"}}>
           <i class="fa fa-plus" aria-hidden="true"></i></Button> </h4>
          <div className="container">
        <h4>Category List</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Update Category</th>
                <th>Delete Category</th>
              </tr>
            </thead>
            <tbody>
              {category.map((category, index) => (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>
                    <Button variant="dark" size="sm" onClick={() => navigate(`/admin/edit-category/${category.id}`)}>
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        </Navbarr>
    </div>
  )
}

export default Category