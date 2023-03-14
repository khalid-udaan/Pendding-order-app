// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
//import mysql2 from 'mysql2';
import db from "./../models/index.js";
//import Order from "../models/order.js";
import shopify from "./shopify.js";
import Sequelize from "sequelize";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { where } from "sequelize";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
// const conn = mysql.createConnection({
//   host: 'localhost',
//   password: 'Udaan!@09',
//   user: 'Udaan',
//   database: 'pending_order'

// })
// //console.log(conn,'connection')
// conn.connect((result, err) => {
//   if (err) throw err;
//   else {
//     console.log('db connected')
//   }
// })
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  // @ts-ignore
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/orders/count", async (_req, res) => {
  const orderCount = await shopify.api.rest.Order.count({
    session: res.locals.shopify.session,
  });
  console.log(orderCount);
  res.status(200).send(orderCount);
})

app.get('/api/product/list', async (_req, res) => {
  const productList = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  })
  console.log(productList);
  res.status(200).send(productList);
})

app.get("/api/orders/list", async (_req, res) => {
  const orders = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: "unfulfilled",
  })

  orders.forEach(async (element) => {
    const line_items = element.line_items;
    // console.log(element);
    const order_id = element.id;
    await line_items.forEach(async (element) => {
      //console.log(element);

      const product_id = element.product_id;
      const product_title = element.title;
      const variant_id = element.variant_id;
      const variant_title = element.variant_title;
      const variant_sku = element.sku;
      const quantity = element.quantity;
      //console.log(product_id);
      const order = await db.Order.findOne({ where: { shopify_order_id: order_id, shopify_product_id: product_id } })
      // console.log(order);
      if (order) {
        //console.log(order);
        const orders = await db.Order.update({
          shopify_order_id: order_id,
          shopify_product_id: product_id,
          shopify_product_title: product_title,
          shopify_variant_id: variant_id,
          shopify_variant_title: variant_title,
          shopify_variant_sku: variant_sku,
          shopify_quantity: quantity
        }, { where: { shopify_order_id: order_id, shopify_product_id: product_id } })
        console.log('data is updtaed');
      } else if (product_id != null) {
        db.Order.create({
          shopify_order_id: order_id,
          shopify_product_id: product_id,
          shopify_product_title: product_title,
          shopify_variant_id: variant_id,
          shopify_variant_title: variant_title,
          shopify_variant_sku: variant_sku,
          shopify_quantity: quantity
        })
        console.log('data is inserted succesfully');
      }
    });
  });
  res.status(200).send(orders);
});
//.........................retrive a specific product with id..............................
// app.get("/api/product", async (_req, res) => {
//   const product = await shopify.api.rest.Product.find({
//     session: res.locals.shopify.session,
//     id: '7407672656062',
//   });

//   console.log(product);  
//   res.status(200).send(product);
// });



//.........retrive products.................
app.get("/api/product", async (_req, res) => {
  const orders = await db.Order.findAll({
    attributes: ["shopify_product_id", [Sequelize.fn("SUM", Sequelize.col("shopify_quantity")), "sum"], "shopify_variant_id","shopify_product_title","shopify_variant_sku","shopify_variant_title"],
    group: ["shopify_product_id", "shopify_variant_id","shopify_product_title","shopify_variant_sku","shopify_variant_title"]
  })

  console.log(orders);
})



app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});





// app.get('/', async( req,res)=>{
//   try{
//     return res.send({
//       status:200,
//       message:'hello from the backend of pending order app'
//     })
//   }catch(err){
//     return res.send({
//       status:400,
//       message: err.message
//     })
//   }

// })


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);

