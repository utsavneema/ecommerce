const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require("moment");
const _ = require("lodash");
const jwt = require ('jsonwebtoken')
const jwtKey = 'hello';
const stripe = require('stripe')
('sk_test_51NaXjeSBT2ulkWI7OTmosn061Duqw1fhlJcVxdMjQckz2LUqllqoCU4QtsyGWyfIHtQVOsmw1FAGmilRvHj27Mzh00wdnhIyar')
// (process.env.STRIPE_SECRET_KEY);

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "proj1",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

function dbSelect(sql, param) {
  return new Promise((resolve) => {
    try {
      con.query(
        sql,
        param,
        function (error, result) {
          if (error) throw error;
          return resolve(result);
        });
    } catch (error) {
      return resolve(result);
    }
  })
}

function dbInsert(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(
      sql, 
      params, 
      (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function dbDelete(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(
      sql, 
      params, 
      (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}


router.post("/pay", async (req, res) => {
  try {
    const totalAmount = _.get(req, "body.totalAmount");
    const orderId = _.get(req, "body.orderId");
    const paymentStatus = "pending";
    
    const amountInCents = totalAmount * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "inr",
      payment_method_types: ["card"],
      metadata: {
        orderId: orderId,
        paymentStatus: paymentStatus,
      },
    });
    
    const clientSecret = paymentIntent.client_secret;
    const paymentId = paymentIntent.id;

    let sql = 'insert into payment (payment_id, payment_status, order_id) values (?, ?, ?)'; 
    const payment = await dbInsert(sql, [paymentId, paymentStatus, orderId]);

    res.json({ clientSecret, paymentId, message: "Payment Initiated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-status", async (req, res) => {
  try {
    const paymentStatus = _.get(req, "body.paymentStatus");
    const orderId = _.get(req, "body.orderId");

    let updateSql = 'UPDATE payment SET payment_status = ? WHERE  order_id = ? ';
    const updateStatus = await dbInsert(updateSql, [paymentStatus, orderId]);

    res.json({ message: "Payment status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
//-----------------------------------------------------------------------------------
router.post("/register", async function (req, res, next) {
  const name = _.get(req, "body.name");
  const email = _.get(req, "body.email");
  const password = _.get(req, "body.password");
  const role = _.get(req, "body.role");

  try {
    let existingSql = 'select id from user where email =?'
    let existingUser = await dbSelect(`${existingSql}`, [email]);
    if (existingUser.length >0) {
        return res.status(401).json({status: false, error: "already exists"})
    }

    let sql = "insert into user (name, email, password, role) values (?, ?, ?, ?)";
    const user = await dbInsert(`${sql}`, [name, email, password, role]);
    return res.status(200).json({ status:true, message: "user inserted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to insert user" });
  }
});

//------------------------------------------------------------------------------
router.post("/login", async function (req, res, next) {
  const email = _.get(req, "body.email");
  const password = _.get(req, "body.password");

  try {
    let sql = "SELECT * FROM user WHERE email = ? AND password = ?"; 
    const user = await dbSelect(sql, [email, password]);

    if (user.length === 0) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user[0].id}, jwtKey);

    return res.status(200).json({ status: true, token: token, user: user[0] }); 
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to perform login" });
  }
});
//************************************************************************************************* */

async function authMiddleWare(req, res, next) {
  try {
    const token = _.get(req, 'headers.authorization', ''); 
    // console.log(token, 'tokennnnnnn');

    if (!token) {
      return res.status(401).json("token nahi mila"); 
    } else {
      const decodedToken = jwt.verify(token, jwtKey);
      // console.log(decodedToken, "decoded");
      
      let sql = 'SELECT * FROM user WHERE id = ?'; 
      const users = await dbSelect(sql, [decodedToken.id]);

      const user = users[0];
      // console.log(user, "User details");

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newUser = { ...user, password:undefined };
      // console.log(newUser);
      req.userDetails = newUser; 
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json("Invalid token."); 
  }
}

router.get('/auth', authMiddleWare, (req, res) => {
  const userDetails = req.userDetails; 
  // console.log(userDetails);
  return res.json({ status: true, userDetails });
});
//***************************************************************************** */

//-------------------------------------insert tag------------------
router.post('/admin/add-tag', async function (req, res, next) {
  const name = _.get(req, 'body.name');
  try{
    let sql = 'INSERT INTO tags (name) VALUES (?)'
    const addTag = await dbInsert (`${sql}`, [name])
    return res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to insert tag" });
  }
});
//************************************************************************************ */

//-------------------------------------------------------------------------------------------
router.put('/admin/update-tag', async function (req, res, next) {
  const tagId = _.get(req, 'query.tagId');
  const newName = _.get(req, 'body.name');
  try{
    let sql = 'UPDATE tags SET name = ? WHERE id = ?'
    const updateTag = await dbInsert (`${sql}`, [newName, tagId]) 
    return res.status(200).json({ status: true, message: 'Tag updated successfully' });
  }catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: 'Failed to update tag' });
  }
});
//**************************************************************************************************** */

router.delete('/admin/delete-tag', async function (req, res, next) {
  const tagId = _.get(req, 'query.tagId');
  // const newName = _.get(req, 'body.name');
  try{
    let sql = 'DELETE from tags WHERE id = ?'
    const deleteTag = await dbDelete(`${sql}`, tagId)
    return res.status(200).json({ status: true, message: 'Tag deleted successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to delete tag" });
  }
});
//------------------------------------------------------------------------------------

router.post('/admin/add-category', async function (req, res, next) {
  const name = _.get(req, 'body.name');
  try{
    let sql = 'INSERT INTO category (name) VALUES (?)'
    const addCategory = await dbInsert (`${sql}`, [name])
    return res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to insert category" });
  }
});
//-------------------------------------------------------------------
router.get("/admin/category-details", async function (req, res, next) {
  // const tagId = _.get(req, 'body.tagId');
  const categoryId = _.get(req, "query.categoryId");
  try{
    let sql = "SELECT * FROM category WHERE id = ?"
    const categoryDetails = await dbSelect (`${sql}`[
      categoryId
    ])
      const categoryData = results[0];
      return res.status(200).json({ status: true, categoryDetails });
  }catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "category not found" });
  }
});
//--------------------------------------------------------------------

//---------------------------------------------------------------------------------
router.put("/admin/update-category",  async function (req, res, next) {
  const categoryId = _.get(req, "query.categoryId");
  const newName = _.get(req, "body.name");
  try{
    let sql = "UPDATE category SET name = ? WHERE id = ?"
    const updateCategory = await dbInsert (`${sql}`, [
      newName, categoryId
    ])
    return res.status(200).json({ status: true, message: "Category updated successfully" })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to update" });
  } 
});
//---------------------------------------------------------------------------------

//-----------------------------------------------------------------------------
router.delete("/admin/delete-category", async function (req, res, next) {
  const categoryId = _.get(req, "query.categoryId");
  // const newName = _.get(req, 'body.name');
  try{
    let sql = "DELETE from category WHERE id = ?"
    let categoryDelete = await dbDelete (`${sql}`, [categoryId])
    return res
        .status(200)
        .json({ status: true, message: "Category deleted successfully" })
  }catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to delete" });
  }
});
//----------------------------------------------------------------------------

//-----------------------------------to upload image-----------------------
router.post("/admin/upload-file", function (req, res, next) {
  const file1 = _.get(req, "files.userfile");
  const imageName = parseInt(Math.random() * 100000);
  const path = imageName;
  file1.mv("./public/images/" + imageName);
  return res.status(200).json({ status: true, message: "success", file1, path });
});
//------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------
router.post("/admin/add-product", async function (req, res, next) {
  const name = _.get(req, "body.name");
  const description = _.get(req, "body.description");
  const created_at = moment().format();
  const updated_at = moment().format();

  const variantData = _.get(req, "body.variantData", []);
  const selectedTags = _.get(req, "body.tags", "");
  const categoryId = _.get(req, "body.categoryId");
  const image = _.get(req, "body.image", "");

  try { 
    let sql = 
    'insert into products (name, description, created_at, updated_at, tag, image, category) VALUES (?,?,?,?,?,?,?)'
    let variantSql = "INSERT INTO variants (variant_title, price, product_id) VALUES (?,?,?)"
    const productResult = await dbInsert(`${sql}`,
      [
        name,
        description,
        created_at,
        updated_at,
        selectedTags,
        image,
        categoryId,
      ]
    );

    const product_id = productResult.insertId;

    variantData.map(async (row) => {
      let variantSql = "INSERT INTO variants (variant_title, price, product_id) VALUES (?,?,?)"
      let title = _.get(row, "variantTitle", "")
      let price = _.get(row, "price", 0)

      await dbInsert(`${variantSql}`, [title, price, product_id]
      );
    })
    return res.status(200).json({ status: true, product_id });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to insert product data" });
  }
});
//****************************************************************************************************************------

//***************************************site-data api by which tags and categories are placed********************************* */
router.get("/admin/site-data", async function (req, res, next) {

  try {
    let categorySql = `select * from category`
    const categorylist = await dbSelect(categorySql);
    // console.log(categorylist)

    let tagSql = `select * from tags`
    const tags = await dbSelect(tagSql);
    
    return res.status(200).json({ status: true, categorylist, tags});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to fetch product details" });
      
  }
});
//********************************************************************************************************** */

//---------------------------------get productdetails (Dynmaic Query)----------------------------------------
router.post("/admin/product-card-list", async function (req, res, next) {
  const page = _.get(req, "body.page");
  const category = _.get(req, "body.category");
  const selectedTags = _.get(req, "body.selectedTags");
  
  const limit = 8;
  const offset = (page - 1) * limit;

  try {
    let sql = 'SELECT * FROM products';
    let sqlCount
    // 'SELECT COUNT(*) AS count FROM products'
    let arr = [];

    if (category > 0) {
      arr.push(`category = ${category}`);
    }

    if (selectedTags) {
      arr.push(`tag LIKE '%${selectedTags}%'`);
      // console.log(selectedTags);
    }

    if (arr.length > 0) {
      sql += ' WHERE ';
      sql += arr.join(' AND ');
    }
    sqlCount = `${sql.replace("*", "count(*) as count ")}`;

    sql = `${sql} LIMIT ${limit} OFFSET ${offset}`;
    
    let productDetails = await dbSelect(sql);
    const allCount = await dbSelect(sqlCount);

    // if (tagId) {
    //   productDetails = productDetails.filter((product) => {
    //     if (product.tag) {
    //       const tags = product.tag.split(',').map(Number);
    //       // console.log(tags, "////////////////////");
    //       let x = tags.includes(tagId);
    //       // console.log(x, "---------------------");
    //       return x;
    //     } else {
    //       return false;
    //     }
    //   });
    // }

    const productIds = productDetails.map((product) => product.product_id);
    let variantList = [];

    if (productDetails.length > 0) {
      const variantsql = 'select * from variants where product_id IN (?)';
      variantList = await dbSelect(variantsql, [productIds]);
    }

    productDetails.forEach((product) => {
      const variants = variantList.filter(
        (variant) => variant.product_id === product.product_id
      );
      product.variants = variants;
    });

    // console.log(productDetails, tagId);

    return res.status(200).json({
      status: true,
      productDetails,
      allCount: allCount[0].count,
      limit
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: "Failed to fetch product details"
    });
  }
}) 
//---**************************************************************************************************************-

router.get("/admin/product-list", async function (req, res, next) {
  try {
    let sql = "SELECT * FROM products"
    const productDetails = await dbSelect (`${sql}`)

    const productIds = productDetails.map((product) => product.product_id);
    const variantsql = 'select * from variants where product_id IN (?)';
    const variantList = await dbSelect(variantsql, [productIds]);

    const tagIds = productDetails
    .map((product) => product.tag)
    .filter((tagId) => tagId !== null && tagId !== "")
    .map((tagId) => tagId.split(","))
    .flat();


    const tagSql = "SELECT * FROM tags WHERE id IN (?)";
    const tagList = await dbSelect(tagSql, [tagIds]);
    

    const categoryIds = productDetails.map((product) => product.category);
    const categorySql = "SELECT * FROM category WHERE id IN (?)";
    const categoryList = await dbSelect(categorySql, [categoryIds])

    // console.log('categoryList:', categoryList);

    const newCategoryList = categoryList.map((category) => {
      return {
        id: parseInt(category.id),
        name: category.name,
      };
    });
    // console.log("newCategoryList: ", newCategoryList);

    productDetails.map((product) => {
      const variants = variantList.filter(
        (variant) => variant.product_id === product.product_id
      );
      product.variants = variants;

      const productTags = product.tag.split(",").map((r) => parseInt(r));
      const tags = tagList.filter((r) => productTags.includes(r.id));
      product.tags = tags.map((tag) => tag.name);
      // let productTags = [];
      // if (_.get(product, "tag", "") !== null) {
      //   productTags = _.get(product, "tag", "")
      //     .split(",")
      //     .filter((r) => r !== "")
      //     .map((r) => parseInt(r));
      // }
      // const tags = tagList.filter((r) => {
      //   if (_.includes(productTags, _.get(r, "id", 0))) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // });
      // _.set(product, "tags", tags);

      const category = newCategoryList.filter(
        (c) => c.id === parseInt(product.category)
      );
      // console.log("category:", category);

      const sameCategory = category[0]; // to access only one category name
      // console.log('category:', category);
      const categoryName = _.get(sameCategory, "name", "");
      product.category = categoryName;
    });

    return res.status(200).json({ status: true, productDetails });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to fetch product details" });
  }
});
//******************************************************************************* */

//--------------------------------------****getproductdetails****---------------------------------------------
router.get("/admin/product-detail", async function (req, res, next) {
  try {
    const productId = _.get(req, "query.productId");
    let sql = "SELECT * FROM products WHERE product_id = ?"
    const productDetail = await dbSelect (`${sql}`,[productId])

    const productIds = productDetail.map((product) => product.product_id);
    const variantsql = 'select * from variants where product_id IN (?)';
    const variantList = await dbSelect(variantsql, [productIds]);

    const categoryIds = productDetail.map((product) => product.category);
    const categorySql = "SELECT * FROM category WHERE id IN (?)";
    const categoryList = await dbSelect(categorySql, [categoryIds])

    const newCategoryList = categoryList.map((category) => {
      return {
        id: parseInt(category.id),
        name: category.name,
      };
    });

    const tagIds = productDetail
      .map((product) => product.tag)
      .filter((tagId) => tagId !== null && tagId !== "")
      .map((tagId) => tagId.split(","))
      .flat();

      const tagSql = "SELECT * FROM tags WHERE id IN (?)";
      const tagList = await dbSelect(tagSql, [tagIds]);

    productDetail.map((product) => {
      const variants = variantList.filter(
        (variant) => variant.product_id === product.product_id
      );
      product.variants = variants;
      
      const productTags = product.tag.split(",").map((r) => parseInt(r));
      const tags = tagList.filter((r) => productTags.includes(r.id));
      product.tags = tags.map((tag) => tag.name);
    //   let productTag = [];
    //   if (_.get(product, "tag", "") !== null) {
    //     productTag = _.get(product, "tag", "")
    //       .split(",")
    //       .filter((r) => r !== "")
    //       .map((r) => parseInt(r));
    //   }
    //   const tag = tagList.filter((r) => {
    //     if (_.includes(productTag, _.get(r, "id", 0))) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
    //   _.set(product, "tags", tag);
    });

    return res.status(200).json({ status: true, productDetail });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to fetch product details" });
  }
});

//----------------------------------------------------------------------------------------------
router.get("/admin/card-detail", async function (req, res, next) {
  try {
    const productId = _.get(req, "query.id");
    let sql = "SELECT product_id, name, description, image, category FROM products WHERE product_id = ?"; 
    const productDetail = await dbSelect(`${sql}`, [productId]);

    const categoryId = productDetail[0].category; 

    const variantsql = 'SELECT * FROM variants WHERE product_id = ?';
    const variantList = await dbSelect(variantsql, [productId]);

    const categoryProductSql = 'SELECT * FROM products WHERE category = ? AND product_id != ?'; 
    const categoryProducts = await dbSelect(categoryProductSql, [categoryId, productId]);

    productDetail[0].variants = variantList; 
    return res.status(200).json({ status: true, productDetail, categoryProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch product" });
  }
});

//---------------------------------------------------------------------------------------
router.put("/admin/update-product", async function (req, res, next) {
  const productId = _.get(req, "query.productId");
  const newName = _.get(req, "body.name");
  const newDescription = _.get(req, "body.description");
  const newImage = _.get(req, "body.image");
  const selectedTags = _.get(req, "body.selectedTags", "").split(",");
  const variants = _.get(req, "body.variants");
  const newCategory = _.get(req, "body.category");
  try{
    
    let sql = "update products SET name = ?, description = ?, image = ?, tag=?, category =? WHERE product_id = ?"
    const updateProduct = await dbInsert (`${sql}`, [
      newName, newDescription, newImage, selectedTags.join(","), newCategory, productId ])

    variants.map(async(row) => {
      if (row.id) {
        let variantsSql = "UPDATE variants SET variant_title = ?, price = ? WHERE id = ?"
        let title = _.get(row, "variant_title", "")
        let price = _.get(row, "price", 0)

      let updateVariants = await dbInsert(`${variantsSql}`, [title, price, row.id])
      } else {
        let variantssSql = "INSERT INTO variants (variant_title, price, product_id) VALUES (?, ?, ?)"
        let title = _.get(row, "variant_title", "")
        let price = _.get(row, "price", 0)

      let insertVariants = await dbInsert(`${variantssSql}`, [title, price, productId])
      }
    });
  
    return res.status(200).json({ status: true, message: "product updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Failed to fetch product details" });
  }
});
///********************************************************************************************* */
router.post("/order-details", authMiddleWare, async function (req, res, next) {
  const name = _.get(req, "body.name");
  const email = _.get(req, "body.email");
  const address = _.get(req, "body.address");
  const status = _.get(req, "body.status")
  const items = _.get(req, "body.items");
  const placedOn = moment().format("MMM Do YY");
  const userId = req.userDetails.id; 
  // console.log(userId);

  try {
    if (!userId) {
      return res.status(404).json({ status: false, error: 'User not found' });
    }

    let sql = 'INSERT INTO oders (name, email, address, userid, status, placed_on) VALUES (?, ?, ?, ?,?, ?)';
    const orderResult = await dbInsert(sql, [name, email, address, userId, status, placedOn]);
    const orderId = orderResult.insertId;
    // console.log(orderId);

    const addItems = items.map((item) => {
      let orderSql = 'INSERT INTO oder_line_items (oder_id, variant_id, quantity) VALUES (?, ?, ?)';
      return dbInsert(orderSql, [orderId, item.variantId, item.quantity]);
    });

    // let paymentSql = 'insert into payment (payment_id, order_id, payment_status) values (?,?,?)'
    // const payment = await dbInsert(paymentSql, [paymentId, orderId, paymentStatus]);

    return res.status(200).json({ status: true, userId, orderId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to place the order" });
  }
});

//*********************************************************************************************** */
router.get("/order-list", authMiddleWare,  async function (req, res, next) {
  const userId = req.userDetails.id;
  // console.log(userId);
  // const placedOn = moment().format();

  try {
    let sql = 'select variants.variant_title, variants.price, oders.oder_id, oders.status, oder_line_items.quantity, products.*, payment.payment_status  from oder_line_items left join oders on oder_line_items.oder_id  = oders.oder_id left join variants on oder_line_items.variant_id = variants.id left join products on variants.product_id = products.product_id left join payment ON payment.order_id = oders.oder_id where oders.userid = ? GROUP BY oders.oder_id ;; '
    const orderList = await dbSelect (sql, [userId])
    return res.status(200).json({ status: true, orderList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch order details" });
  }
});
//************************************************************************************** */
router.get("/item-details", authMiddleWare, async function (req, res, next) {
  const userId = req.userDetails.id;
  // console.log(userId);
  const oder_id = req.query.oder_id; 
  // console.log(oder_id);

  try {
    let sql = 'select variant_id, quantity , variants.variant_title, variants.price, products.name as productname, products.image, products.description from oder_line_items  left join oders on oder_line_items.oder_id = oders.oder_id left join variants on oder_line_items.variant_id = variants.id left join  products on variants.product_id = products.product_id where oders.oder_id = ? and  oders.userid =?'

    const orderList = await dbSelect(sql, [oder_id, userId]);

    return res.status(200).json({ status: true, orderList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch order details" });
  }
});

//*************************************************************************************************** */
router.get ("/all-orders", async function (req, res, next){
  const oder_id = _.get(req, "query.oder_id")
  try{
    let sql = "select oders.name as username, oders.email, oders.oder_id, oders.status, oders.placed_on, variants.variant_title, variants.price,products.product_id, products.name as productname, products.description, products.image, oder_line_items.quantity  from oders left join oder_line_items on oders.oder_id = oder_line_items.oder_id left join variants on oder_line_items.variant_id = variants.id left join products on variants.product_id = products.product_id GROUP BY oders.oder_id;"
    // "select *from oders left join oder_line_items on oders.oder_id = oder_line_items.id;"
    const allOrders = await dbSelect(sql, [oder_id]);
    return res.status(200).json({ status: true, allOrders });
  }catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch order details" });
  }
})
//-----------------------------------------------------------------------------------------
router.get("/admin/item-details", authMiddleWare, async function (req, res, next) {
  const userId = req.userDetails.id;
  // console.log(userId);
  const oder_id = req.query.oder_id; 
  // console.log(oder_id);

  try {
    let sql = 'select variant_id, quantity , variants.variant_title, variants.price, products.name as productname, products.image, products.description from oder_line_items  left join oders on oder_line_items.oder_id = oders.oder_id left join variants on oder_line_items.variant_id = variants.id left join  products on variants.product_id = products.product_id where oders.oder_id = ?'

    const orderList = await dbSelect(sql, [oder_id, userId]);

    return res.status(200).json({ status: true, orderList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch order details" });
  }
});
//***************************************************************************************************** */

router.put('/cancel-order', authMiddleWare, async function (req, res, next) {
  const userId = req.userDetails.id;
  // const oder_id = _.get(req, "query.oder_id");
  const oder_id = _.get(req,"body.oder_id") 
  // console.log(oder_id); 

  try {
    const sql = 'UPDATE oders SET status = ? WHERE userid = ? and oder_id=?';
    const result = await dbInsert(sql, ['cancelled', userId, oder_id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ status: true, message: 'Order cancelled successfully' });
    } else {
      return res.status(400).json({ status: false, message: 'Failed to cancel order' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: 'Failed to cancel order' });
  }
});
//-----------------------------------------------------------------------------------------
router.put('/complete-order', authMiddleWare, async function (req, res, next) {
  // console.log("Received request data:", req.body);
  const userId = req.userDetails.id;
  // console.log(userId);
  const order_id = req.body.oder_id; 
  // console.log(order_id, "*****************************************"); 

  try {
    const sql = 'UPDATE oders SET status = ? WHERE oder_id = ?';
    // console.log("SQL Query:", sql, ['completed',order_id]);
    const result = await dbInsert(sql, ['completed', order_id]);
    // console.log("Database update result:", result);

    if (result.affectedRows > 0) {
      return res.status(200).json({ status: true, message: 'Order completed successfully' });
    } else {
      return res.status(400).json({ status: false, message: 'Failed to complete order' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: 'Failed to complete order' });
  }
});
//************************************************************************************************** */
router.get("/order-chart-data", async function (req, res, next){
  try {
    let sql = 'select DATE(oders.placed_on) as order_date, SUM(oder_line_items.quantity * variants.price) as total_amount from oder_line_items left join oders on oder_line_items.oder_id = oders.oder_id left join variants on oder_line_items.variant_id = variants.id group by DATE(oders.placed_on)'

    const chartData = await dbSelect(sql);

    return res.status(200).json({status: true, chartData});
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch order chart data" });
  }
})

module.exports = router;

//-----------------------------------------------to get all ids-----------------
// router.get("/getid", function (req, res) {
//   con.query('SELECT * FROM products', (error, results) => {
//     if (error) {
//       console.error('Error', error);
//     } else {
//       let productIds = results.map((row) => row.tag);
//       const tags = []
//       productIds.forEach((r)=>{

//         if(r!==null && r!==''){
//           const tagsArry = r.split(',')
//           tagsArry.map((n)=>tags.push(parseInt(n)))

//         }
//       })
//       console.log(productIds,tags);
//       res.json(tags);
//     }
//     con.end();
//   });
// })