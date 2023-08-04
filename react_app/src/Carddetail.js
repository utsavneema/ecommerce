import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, priceFormat } from "./helpers";
import Frontlayout from "./Front/Frontlayout";
import Card from "react-bootstrap/Card";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "./redux/slices/cartSlice";

const Carddetail = (props) => {
  const { id } = useParams();
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState(null);
  const [variants, setVariants] = useState([]);
  const [image, setImage] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("productId:", id);
    fetchProductDetail(id);
  }, [id]);

  const fetchProductDetail = async (id) => {
    try {
      const response = await axios.get(baseUrl + "api/admin/card-detail", {
        params: { id: id },
      });

      const { productDetail, categoryProducts } = response.data;
      console.log(productDetail);

      if (productDetail.length > 0) {
        const { name, description, variants, image } = productDetail[0];
        setProductDetail({ name, description });
        setVariants(variants);
        setImage(image);
        setCategoryProducts(categoryProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cardClick = (productId) => {
    navigate(`/detail/${productId}`);
  };

  return (
    <Frontlayout>
      <div style={{ backgroundColor: "#cbcbcb" }}>
        <Container style={{ maxWidth: "800px" }}>
          {productDetail && (
            <Row className="justify-content-center">
              <Col sm={8}>
                <Card className="mb-2" style={{ backgroundColor: "#cbcbcb" }}>
                  <Row>
                    <Col sm={4}>
                      <Card.Img
                        variant="top"
                        src={baseUrl + `/images/` + image}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Col>
                    <Col sm={8}>
                      <Card.Body>
                        <Card.Title>{productDetail.name}</Card.Title>
                        <Card.Text>{productDetail.description}</Card.Text>
                        {variants.length > 0 && (
                          <div>
                            <div className="d-flex justify-content-between">
                              <strong>Variants</strong>
                              <b>Price</b>
                              <b>Add to Cart</b>
                            </div>
                            <div
                              className="custom-table-wrapper"
                              style={{ backgroundColor: "#cbcbcb" }}>
                              <Table striped bordered hover>
                                <tbody>
                                  {variants.map((variant) => (
                                    <tr className="table-secondary" key={_.get(variant, "variant_id", "")} >
                                      <td>
                                        {_.get(variant, "variant_title", "")}
                                      </td>
                                      <td className="d-flex justify-content-between align-items-center">
                                        <span>
                                          {priceFormat()}{" "}
                                          {_.get(variant, "price", "")}
                                        </span>
                                        <Button
                                          variant="dark"
                                          onClick={() =>
                                            dispatch(
                                              addItem({
                                                productId: id,
                                                variantId: variant.id,
                                                name: variant.variant_title,
                                                productName: productDetail.name,
                                                description:
                                                  productDetail.description,
                                                productImage: image,
                                                price: variant.price,
                                              })
                                            )
                                          }>
                                          <i class="fa fa-plus" aria-hidden="true"></i>
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      <div>
        {categoryProducts.length > 0 && (
          <div style={{ backgroundColor: "#cbcbcb" }}>
            <Row>
              <Col sm={12}>
                <h4 className="text-left">You May Also Like</h4>
              </Col>
            </Row>
            <Row>
              {categoryProducts.map((product) => (
                <Col sm={3} key={product.product_id}>
                  <Card
                    className="mb-2"
                    onClick={() => cardClick(product.product_id)}
                    style={{ backgroundColor: "#cbcbcb", height: "250px" }}
                  >
                    <Row>
                      <Col sm={4}>
                        <Card.Img
                          variant="top"
                          src={baseUrl + `/images/` + product.image}
                          style={{ width: "100%", height: "80%" }}
                        />
                      </Col>
                      <Col sm={8}>
                        <Card.Body>
                          <Card.Title>{product.name}</Card.Title>
                          <Card.Text>{product.description}</Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Frontlayout>
  );
};

export default Carddetail;
