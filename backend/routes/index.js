var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


// router.post("/admin/product-card-list", async function (req, res, next) {
//   const page = _.get(req, "body.page");
//   const category = _.get(req, "body.category");

//   // console.log(page,'--------------------------');
//   const limit = 8;
//   const offset = (page - 1) * limit;

//   // console.log(offset, '/////////////////////////////////////');
//   // console.log("value of offset is:", offset);

//   try {
//     let productDetails;
    

//     if (category) {
//       productDetails = await new Promise((resolve, reject) => {
//         con.query(
//           `SELECT * FROM products where products.category = ${category} limit ? offset ?`,
//           //  'select * from products p join variants v on p.product_id = v.product_id where category = ?'
//           [limit, offset],
//           (error, results) => {
//             if (error) {
//               console.error("Error", error);
//               reject(error);
//             } else {
//               resolve(results);
//             }
//           }
//         );
//       });
//     } else {
//       productDetails = await new Promise((resolve, reject) => {
//         con.query(
//           "SELECT * FROM products limit ? offset ?",
//           [limit, offset],
//           (error, results) => {
//             if (error) {
//               console.error("Error", error);
//               reject(error);
//             } else {
//               resolve(results);
//             }
//           }
//         );
//       });
//     }

//     const productIds = productDetails.map((product) => product.product_id);

//     const variantList = await new Promise((resolve, reject) => {
//       con.query(
//         "SELECT * FROM variants WHERE product_id IN (?)",
//         [productIds],
//         function (error, results) {
//           if (error) {
//             console.error(error);
//             reject(error);
//           } else {
//             resolve(results);
//           }
//         }
//       );
//     });

//     const tagIds = productDetails
//       .map((product) => product.tag)
//       .filter((tagId) => tagId !== null && tagId !== "")
//       .map((tagId) => tagId.split(","))
//       .flat();

//     const tagList = await new Promise((resolve, reject) => {
//       con.query(
//         "SELECT * FROM tags WHERE id IN (?)",
//         [tagIds],
//         function (error, results) {
//           if (error) {
//             console.error(error);
//             reject(error);
//           } else {
//             resolve(results);
//           }
//         }
//       );
//     });

//     const categoryIds = productDetails.map((product) => product.category);

//     const categoryList = await new Promise((resolve, reject) => {
//       con.query(
//         "SELECT * FROM category WHERE id IN (?)",
//         [categoryIds],
//         function (error, results) {
//           if (error) {
//             console.error(error);
//             reject(error);
//           } else {
//             resolve(results);
//           }
//         }
//       );
//     });

//     // console.log('categoryList:', categoryList);

//     const newCategoryList = categoryList.map((category) => {
//       return {
//         id: parseInt(category.id),
//         name: category.name,
//       };
//     });

//     // console.log('newCategoryList: ', newCategoryList)

//     productDetails.forEach((product) => {
//       const variants = variantList.filter(
//         (variant) => variant.product_id === product.product_id
//       );
//       product.variants = variants;

//       let productTags = [];
//       if (_.get(product, "tag", "") !== null) {
//         productTags = _.get(product, "tag", "")
//           .split(",")
//           .filter((r) => r !== "")
//           .map((r) => parseInt(r));
//       }
//       const tags = tagList.filter((r) => {
//         if (_.includes(productTags, _.get(r, "id", 0))) {
//           return true;
//         } else {
//           return false;
//         }
//       });
//       _.set(product, "tags", tags);
//       //       const category = categoryList.find((category) => category.id === product.category);
//       //   _.set(product, 'categoryName', _.get(category, 'name', ''));     });

//       // console.log('categoryName:', category);

//       const category = newCategoryList.filter(
//         (c) => c.id === parseInt(product.category)
//       );
//       // console.log('category:', category);

//       const sameCategory = category[0]; // to access only one category name
//       // console.log('category:', category);
//       const categoryName = _.get(sameCategory, "name", "");
//       product.category = categoryName;
//     });

//     const allCount = await new Promise((resolve, reject) => {
//       con.query("select count(*) as count from products", (error, results) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const count = _.get(results, "[0].count", 0);
//           // console.log(count);
//           resolve(count);
//         }
//       });
//     });

//     // const categoryId = await new Promise ((resolve, reject)=>{
//     //   con.query('select * from products p join variants v on p.product_id = v.product_id where category = ?',
//     //   [category], (error, results)=>{
//     //     if (error) {
//     //       console.error('Error', error);
//     //       reject(error);
//     //     } else {
//     //       resolve(results);
//     //       console.log('helloooooooooooooooooooooooo')
//     //     }
//     //   })
//     // })

//     // const totalPages = (count/limit);
//     // console.log(totalPages);

//     return res
//       .status(200)
//       .json({ status: true, productDetails, allCount, limit, category });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: false, error: "Failed to fetch product details" });
//   }
// });

// let sql = 'insert into products'
    // sql = `${sql} name ${name} description ${description} created_at ${created_at} updated_at ${updated_at} tag ${selectedTags} image ${image} category ${categoryId}`

    // const productResult = await dbInsert(sql)