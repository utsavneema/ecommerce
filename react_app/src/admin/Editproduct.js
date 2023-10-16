import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../helpers";
import { Form, Container, Button, Table } from "react-bootstrap";
import Navbarr from "./Navbar";
import _ from "lodash";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [rows, setRows] = useState([]);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [category, setCategory] = useState([]);
  // const [categoryName, setCategoryName] = useState([]);

  const [categoryList, setCategoryList] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState([]);

  useEffect(() => {
    fetchProduct(id);
    getSiteData();
  }, [id]);

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(baseUrl + "api/admin/product-detail", {
        params: { productId: id },
      });

      const { productDetail } = response.data;
      console.log(response.data);
      setName(productDetail[0].name);
      setDescription(productDetail[0].description);

      // const variants = productDetail[0].variants;

      const variants = productDetail[0].variants;
      setRows(variants);
      // setVariants(variants);
      // console.log(rows);

      // setTags(productDetail[0].tags)
      setImage(productDetail[0].image);

      const tagNames = productDetail[0].tag.split(",");
      console.log(tagNames);

      setTags(productDetail[0].tags);

      // Store selected tag names in the 'selectedTags' state
      setSelectedTags(tagNames);
      // const tagIds = productDetail[0].tags.map((tag) => tag.id);
      // setSelectedTags(tagIds);

      setCategory(productDetail[0].category);

      // setCategory(productDetail[0].category);
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

  const imageUpload = async (files) => {
    if (files[0] !== undefined) {
      const formData = new FormData();
      formData.append("userfile", files[0]);

      const config = {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      };

      try {
        const response = await axios.post(
          baseUrl + "api/admin/upload-file",
          formData,
          config
        );
        console.log(response);
        if (response) {
          setImage(response.data.path);
          // console.log("image updated successfully");
        } else {
          console.error("Failed to upload");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {

      // console.log(name, id );
      const response = await axios.put(
        baseUrl + "api/admin/update-product",
        {
          name: name,
          description: description,
          variants: rows,
          image: image,
          selectedTags: selectedTags.join(","),
          category: category,
        },
        {
          params: { productId: id },
        }
      );
      if (response.data.status) {
        // console.log(response.data);
        // console.log(" updated successfully");
        navigate("/admin/productlist");
      } else {
        console.error("Failed to update tag:", _.get(response, "data.error"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const AddRow = () => {
    const newRow = { variantTitle: "", price: "" };
    setRows([...rows, newRow]);
  };

  const DeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const TableChange = (index, field, value) => {
    const updatedRows = [...rows];

    if (updatedRows[index]) {
      updatedRows[index][field] = value;
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

  const doimageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  return (
    <div style={{ backgroundColor: "#cbcbcb" }}>
      <Navbarr>
        <Container
          className="justify-content-center align-items-center"
          style={{ height: "100%" }}
        >
          <h3 style={{ textAlign: "center" }}>Update the Product</h3>

          <Form className="container">
            <strong>Category</strong>
            <Form.Select
              aria-label="Default select example"
              style={{ marginBottom: "20px" }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Select Category</option>
              {categoryList.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </Form.Select>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
              style={{ width: "80%" }}
            >
              <strong style={{ marginBottom: "20px" }}>Product Name</strong>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <strong style={{ marginBottom: "20px" }}>Description</strong>
              <Form.Control
                as="textarea"
                placeholder="Write Description here"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                <b>Add File</b>
              </Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => imageUpload(e.target.files)}
              />
            </Form.Group>

            {/* onChange={(e) => setImage(e.target.files[0])} */}
            <div>
              {image && (
                <img
                  src={baseUrl + `images/` + image}
                  style={{ width: "10%" }}
                ></img>
              )}
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
                <Button variant="dark" size="sm" onClick={AddRow}>
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
                    value={row.variant_title} //column name
                    style={{ width: "80%" }}
                    onChange={(e) =>
                      TableChange(index, "variant_title", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.price}
                    style={{ width: "80%" }}
                    onChange={(e) =>
                      TableChange(index, "price", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => DeleteRow(index)}
                  >
                    <i class="fa fa-trash" aria-hidden="true"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
          <Button variant="dark" onClick={handleUpdate} style={{ marginBottom: "10px" }}>
            Update Data
          </Button>
        </div>
      </Navbarr>
    </div>
  );
};

export default Product;
