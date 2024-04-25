import express, { request } from 'express';
import data from './data.js';
import cors from 'cors';
import mongoose  from 'mongoose';
import userRouter from './routers/userRoute.js';
import bodyParser from 'body-parser';
import orderRouter from './routers/orderRouter.js';

mongoose.connect('mongodb://localhost:27017/Ecommerce', {
    useNewUrlParser: true, 
  })
  .then(() => {
    console.log('Connected to mongodb.');
  })
  .catch((error) => {
    console.log(error.reason);
  });



const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/users/', userRouter);
app.use('/api/orders/', orderRouter);


app.get("/api/products", (req,res) => {
    res.send(data.products);
});


app.get("/api/products/:id", (req, res) => {
      const product = data.products.find((x)=> x._id === req.params.id);
      if(product){
        res.send(product);
      }

      else{
        res.status(404).send({message: 'Product not found'});
      }
});

// app.get("/api/paypal/clientId", (req, res)=> {
  
// });

let salt_key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
let merchant_id = 'PGTESTPAYUAT';

// app.post('/api/paymentorder', async(req, res)=>{
//     try{

//         const myData = {
//             merchantId: req.body.MID,
//             merchantTransactionId: req.body.transactionId,
//             name: req.body.name,
//             amount: req.body.amount*100,
//             redirectUrl: `http://localhost:5000/api/paymentorder/status?id=${merchantTransactionId}`,

//             redirectMode: 'POST',
//             mobileNumber: req.body.number,
//             paymentInstrument:{
//               type: "PAY_PAGE"
//             }
//         }


//         const payload = JSON.stringify(myData);
//         const payloadMain = Buffer.from(payload).toString('base64');
//         const keyIndex = 1;
//         const string = payloadMain + 'pg/v1/pay' + salt_key;
//         const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//         const checksum= sha256 + '###' + keyIndex;

//         const prod_URL =  'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

//         const options= {
//           method: 'POST',
//           url: prod_URL,
//           Headers:{
//             accept: 'application/json',
//             'Content-Type':'application/json',
//             'X-VERIFY': checksum,
//           },
//           data:{
//             request:payloadMain
//           },
//         }

//         await axios(options).then(function(response){
//             console.log(response.data);
//             return res.json(response.data);
//         }).catch(function(error){
//           console.log(error);
//         })

//     }

//     catch(error){
//       console.log(error);
//     }
// });









app.post('/api/paymentorder', async(req, res) => {
  try {
      const myData = {
          merchantId: merchant_id,
          merchantTransactionId: req.body.transactionId,
          name: req.body.name,
          amount: req.body.amount * 100, // Corrected typo
          redirectUrl: `http://localhost:5000/api/paymentorder/status?id=${req.body.transactionId}`, // Corrected undefined variable
          redirectMode: 'POST',
          mobileNumber: req.body.number,
          paymentInstrument: {
              type: "PAY_PAGE"
          }
      }

      const payload = JSON.stringify(myData);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const string = payloadMain + 'pg/v1/pay' + salt_key;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + keyIndex;

      const prod_URL = ' https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay';

      const options = {
          method: 'POST',
          url: prod_URL,
          headers: { // Corrected property name
              accept: 'application/json',
              'Content-Type': 'application/json',
              'X-VERIFY': checksum,
          },
      };

      // Moved data outside options and stringify it
      const requestData = {
          request: payloadMain
      };

      await axios.post(prod_URL, requestData, options)
          .then(function(response) {
              console.log(response.data);
              return res.json(response.data);
          })
          .catch(function(error) {
              console.log(error);
          });
  } catch (error) {
      console.log(error);
  }
});


app.use((err,req, res, next) => {
  const status = err.send && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({message: err.message});
});






app.listen(5000, ()=> {
  console.log('serve at 5000');  
})


