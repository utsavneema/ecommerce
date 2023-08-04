import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Container, Button, Table, Badge } from "react-bootstrap";
import Navbarr from "./Navbar";
import { baseUrl } from "../helpers";
import _ from "lodash";

const Product = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
  
    getSiteData();
  }, []);

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

  const handleAddRow = () => {
    const newRow = { variantTitle: "", price: "" };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleTableChange = (index, field, value) => {
    const updatedRows = [...rows];
    if (updatedRows[index]) {
      updatedRows[index] = {
        ...updatedRows[index],
        [field]: value
      };
      setRows(updatedRows);
    } else {
      console.error("Invalid index:", index);
    }
  };

  const checkboxChange = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((name) => name !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmitData = async (event) => {
    event.preventDefault();
    if (!name || !description) {
      alert("Please enter all fields");
      return;
    }

    const response = await axios.post(baseUrl+"api/admin/add-product", {
      name: name,
      description: description,
      variantData: rows,
      tags: selectedTags.join(","),
      image: image,
      categoryId: category,
     
    });
    console.log("DATA INSERTED", response);
    navigate("/admin/productlist");
  };

  const imageUpload = async (files) => {
    if (files[0] !== undefined) {
      const formData = new FormData();
      formData.append('userfile', files[0]); // Append your file data to the form data
  
      const config = {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      };
  
      try {
        const response = await axios.post(baseUrl+'api/admin/upload-file', formData, config);
        console.log(response);
        console.log(response.data.path);
        if (response) {
          setImage(response.data.path);
          console.log('image updated successfully');
        } else {
          console.error('Failed to upload');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#cbcbcb" }}>
      <Navbarr>
        <Container className=" justify-content-center align-items-center" style={{ height: "100%" }}>
          <h2 style={{ textAlign: "center" }}>Welcome to our Product page</h2>

          <Form className="container">
            <strong>Category</strong>
            <Form.Select
            aria-label="Default select example"
            style={{ 
            marginTop: "15px", marginBottom: "10px", backgroundColor: "#cbcbcb", width: "250px", marginRight: "20px",}}
            value={category} onChange={(e) => setCategory(e.target.value)}>
            <option style={{ fontWeight: "bold" }}>Select Category</option>
            {categoryList.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </Form.Select>
          
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ width: "80%" }}>
              <strong style={{ marginBottom: "20px" }}>Product Name</strong>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <strong style={{ marginBottom: "20px" }}>Description</strong>
              <Form.Control as="textarea" placeholder="Write Description here" rows={5} value={description}
              onChange={(e) => setDescription(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
            <Form.Label><b>Add File</b></Form.Label>
            <Form.Control type="file" onChange={(event)=> imageUpload(event.target.files)} onClick={(e)=>{e.target.files = null}} />
              </Form.Group>
              <div>
                {image && (
                <img src ={baseUrl+`images/`+ image} style={{maxwidth:'20%'}}></img>)}
              </div>
            <strong>Tags:</strong>
            {tags.map((tag) => (
              <Form.Check
                key={tag.name}
                type="checkbox"
                label={tag.name}
                onChange={() => checkboxChange(tag.name)}
                checked={selectedTags.includes(tag.name)}
              />
            ))}
          </Form>
        </Container>
        <Table className="container mt-4" bordered>
          <thead>
            <tr>
              <th>Variant Title</th>
              <th>Price</th>
              <th>
              <Button variant="dark" size="sm" onClick={handleAddRow}  style={{marginTop: "10px"}}>
              <i class="fa fa-plus" aria-hidden="true"></i>
          </Button>
              </th>
            </tr>
          </thead>
          
          <tbody>
  {rows.map((row, index) => (
    <tr key={index}>
      <td>
        <input
          type="text"
          value={row.variantTitle}
          onChange={(e) => handleTableChange(index, "variantTitle", e.target.value)}
          style={{ width: "80%" }}
        />
      </td>
      <td>
        <input
          type="number"
          value={row.price}
          onChange={(e) => handleTableChange(index, "price", e.target.value)}
          style={{ width: "80%" }}
        />
      </td>
      <td>
        {index >= 1 && (
          <Button variant="danger" size="sm" onClick={() => handleDeleteRow(index)}> <i class="fa fa-trash" aria-hidden="true"></i> </Button>
        )}
      </td>
    </tr>
  ))}
</tbody>
        </Table>
        <div className="d-flex justify-content-center">
        <Button variant="dark" onClick={handleSubmitData} style={{ marginBottom:"10px" }}> Save Data </Button>
        {/* backgroundImage: "linear-gradient(to bottom right, red, yellow)", */}
        </div>
      </Navbarr>
    </div>
  );
};

export default Product;
