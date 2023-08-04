import React, { useEffect, useState } from "react";
import Navbarr from "./Navbar";
import axios from "axios";
import { Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { baseUrl, priceFormat } from "../helpers";

const Productlist = () => {
  const [productDetails, setProductDetails] = useState([]);
  const navigate = useNavigate('');

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      const response = await axios.get(baseUrl+"api/admin/product-list");
      if (response.data.status) {
        const { productDetails } = response.data;
        setProductDetails(productDetails);
      } else {
        console.error("Failed to fetch product details:", response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const variantBadge = (variantId) => {
    const colorIndex = variantId % 5; // for 5 variants only
    const colors = ["secondary", "success", "dark", "info", "warning"];
    return _.get(colors, colorIndex);
  };

  const tagBadge = (tagName) => {
    const colorIndex = tagName % 5; // for 5 variants only
    const colors = ["success", "secondary", "info", "warning", "primary"];
    return _.get(colors, colorIndex);
  };


  return (
    <Navbarr>
      <div style={{ backgroundColor: "#cbcbcb" }}>
        <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <h3 >Product List</h3>
         <button className="btn btn-dark mt-1 mb-2" onClick={() => navigate('/admin/product')}> Add Product </button>
         </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Created_at</th>
                <th>Updated_at</th>
                <th>Category</th>
                <th>Image</th>
                <th colSpan="2">Variants</th>
                <th>Tags</th>
                <th>Edit Products</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Title</th>
                <th>Price</th>
                <th></th><th></th>
              </tr>
            </thead>
            <tbody>
              {productDetails.map((product, index) => (
                <tr key={product.product_id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.created_at}</td>
                  <td>{product.updated_at}</td>
                  <td>{product.category}</td>
                  <td>
                  <td>
                    {product.image ? (
                        <img src ={baseUrl+`images/${product.image}`} style={{width: '60%'}}></img> 
                    ):(
                        <sapn> no Image</sapn>
                    )}     
                  </td>
                  </td>
                  <td colSpan="2">
                    <Table bordered>
                      <tbody>
                        {product.variants.map((variant, variantIndex) => (
                          <tr key={variant.variant_id}>
                            <td>
                              <Badge
                                bg={variantBadge(variantIndex)}
                                style={{ marginRight: "5px" }}>
                                {variant.variant_title}
                              </Badge>
                            </td>
                            <td>{variant.variant_title}</td>
                            <td>{priceFormat()}{variant.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </td>
                  <td>
                    {product.tag && product.tag.length > 0 ? (
                      product.tag.split(",").map((tagName) => (
                        <Badge
                          key={tagName}
                          variant={tagBadge(tagName)}
                          style={{ marginRight: "5px" }}>
                          {tagName}
                        </Badge>
                      ))
                    ) : (
                      <span>No tags</span>
                    )}
                  </td>
                  <td><Button variant="dark" size="sm" onClick={() => navigate(`/admin/edit-product/${product.product_id}`)} >
                      Edit
                    </Button></td>
                    
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Navbarr>
  );
};

export default Productlist;
