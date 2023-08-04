// import React, { useState } from 'react';
import axios from "axios";
import { baseUrl } from "../helpers";
import { useState, useEffect } from "react";
import Frontlayout from "./Frontlayout";
// import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import Card from "./Card";
import Carddetail from "../Carddetail";
import { Form } from "react-bootstrap";
import _ from "lodash";

const Frontproduct = () => {
  const navigate = useNavigate("");
  const [productDetails, setProductDetails] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, settotalPages] = useState(0);
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagId, setTagId] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  // console.log(cart); 
  

  // const [price, setPrice] = useState('')

  useEffect(() => {
    // console.log(productId)
    getProductDetails(page);
    // console.log(page);
    getSiteData();
  }, 
  [category, selectedTags, page]);
  // console.log(tagId, "---------------------------------------")

  const getProductDetails = async (page) => {
    try {
      const cardPage = {
        page: page,
        category: category,
        selectedTags: selectedTags
        
        // selectedTags: selectedTags,
        
       
        // categoryId: categoryId,
        // searchText: searchText,
      };

      const response = await axios.post(
        baseUrl + "api/admin/product-card-list", cardPage);
      // console.log (typeof(tagId,"/////////////////////////////"))
      if (response.data.status) {
        const { productDetails, allCount, limit } = response.data;
        // console.log(productDetails);

        setProductDetails(productDetails);
        // setProductDetails(response.data.productDetails);

        // console.log(response.data.allCount);
        // console.log(response.data.limit);

        settotalPages(Math.ceil(allCount / limit));
        // setPage(page);
        // console.log(Math.ceil(allCount / limit));

        // console.log(productDetails);
      } else {
        console.error("Failed to fetch product details:", response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSiteData = async () => {
    try {
      const response = await axios.get(baseUrl + "api/admin/site-data");
      if (response.data.status) {
        setCategoryList(response.data.categorylist);
        // console.log(response.data.categorylist);
        setTags(response.data.tags);
        // console.log(response.data.tags);
      } else {
        console.error("Failed to fetch data:", response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const checkboxChange = (tagName) => {
    let newTags = [...selectedTags];
    if (!newTags.includes(tagName)) {
      newTags.push(tagName);
    } else {
      newTags = newTags.filter((name) => name !== tagName);
    }
    setSelectedTags(newTags);

    // console.log(newTags);
  };

  const cardDetail = (id) => {
    navigate(`/detail/${id}`); 
  };
  
  return (   
    <Frontlayout>
      <div style={{ backgroundColor: "#cbcbcb" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form.Select
            aria-label="Default select example"
            style={{ 
              marginTop: "15px", marginBottom: "10px", backgroundColor: "#cbcbcb", width: "250px", marginRight: "20px",}}
            value={category} onChange={(e) => setCategory(_.parseInt(e.target.value))}>
            <option style={{ fontWeight: "bold" }}>Select Category</option>
            {categoryList.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </Form.Select>

          <div style={{ display: "flex", alignItems: "center" }}>
            <strong style={{ marginRight: "10px" }}>Tags:</strong>
            {tags.map((tag) => (
              <Form.Check
                key={tag.name}
                type="checkbox"
                label={tag.name}
                checked={selectedTags.includes(tag.name)}
                onChange={() => checkboxChange(tag.name)}
                style={{ marginRight: "10px" }}
              />
            ))}
          </div>
        </div>
        <div className="row" style={{ backgroundColor: "#cbcbcb" }}>
          
      {productDetails.map((data) => (
        <div
          key={data.productId}
          
          className="col-md-3 col-sm-3 "
          style={{ display: "flex", justifyContent: "center" }}>
          <Card
            name={_.get(data, "name", "")}
            productId={_.get(data, "product_id", 0)}
            image={_.get(data, "image", "")}
            price={_.get(data, "variants[0].price", "")}
            cardDetail={cardDetail}
          />
        </div>
      ))}
</div>     
        <div
          className="pagination justify-content-center"
          style={{ backgroundColor: "#cbcbcb" }}>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}> &laquo;
              </button>
            </li>
            {[...Array(totalPages)].map((data, index) => (
              <li
                key={index} className={`page-item ${page === index + 1 ? "active" : ""}`} >
                <button
                  className="page-link"
                  onClick={() => setPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Frontlayout>
  );
};
export default Frontproduct;