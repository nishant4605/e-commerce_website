import { parseRequestUrl, showLoading, hideLoading, showMessage, rerender } from '../util';
import { getOrder, deliverOrder } from '../api';
import { getUserInfo } from '../localStorage';
import axios from 'axios';

const OrderScreen = {
  after_render: async () => {
    const request = parseRequestUrl();
    if (document.getElementById('deliver-order-button')) {
      document.addEventListener('click', async () => {
        showLoading();
        await deliverOrder(request.id);
        hideLoading();
        showMessage('Order Delivered.');
        rerender(OrderScreen);
      });
    }

    // const sendOrderData = async () => {
    //   const order = await getOrder(request.id);
    //   console.log(order);

    //   let myData = {
    //     name: "Sumit",
    //     amount: order.totalPrice,
    //     number:55555555,
    //     MID: 'MID' + Date.now(),
    //     transactionId: 'T'+Date.now()
    //   }
    //   console.log(myData);

    //   try {
    //     const response = await axios.post('http://localhost:5000/api/paymentorder', myData).then(res => {
    //       console.log(res.data);

    //       if(res.data.success == true){
    //         window.location.href = 'res.data.data.instrumentResponse.redirectInfo.url'
    //       }
    //     }).catch(err=>{
    //       console.log(err);
    //     })

    //     showMessage('Order data sent successfully.');
    //   } 
      
    //   catch (error) {
    //     console.error('Error sending order data:', error);
    //   }
    // };




    const sendOrderData = async () => {
      try {
          const order = await getOrder(request.id);
          console.log(order);
  
          const myData = {
              name: "Sumit",
              amount: order.totalPrice,
              number: 55555555,
              MID: 'MID' + Date.now(),
              transactionId: 'T' + Date.now()
          };
          console.log(myData);
  
          const response = await axios.post('http://localhost:5000/api/paymentorder', myData);
  
          console.log(response.data);
  
          if (response.data.success === true) { // Corrected typo
              const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url; // Extracting redirect URL
              window.location.href = redirectUrl;
          } else {
              // Handle failure scenario
              console.error("Payment order failed");
          }
  
          showMessage('Order data sent successfully.');
      } catch (error) {
          console.error('Error sending order data:', error);
      }
  };
  

    const sendOrderButton = document.getElementById('send-order-button');
    if (sendOrderButton) {
      sendOrderButton.addEventListener('click', async () => {
        showLoading();
        await sendOrderData();
        hideLoading();
      });
    }
  },

  render: async () => {
    const { isAdmin } = getUserInfo();
    const request = parseRequestUrl();
    const {
      _id,
      shipping,
      payment,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);

    return `
      <div>
        <h1>Order ${_id}</h1>
        <div class="order">
          <div class="order-info">
            <div>
              <h2>Shipping</h2>
              <div>
                ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}
              </div>
              ${
                isDelivered
                  ? `<div class="success">Delivered at ${deliveredAt}</div>`
                  : `<div class="error">Not Delivered</div>`
              }
            </div>
            <div>
              <h2>Payment</h2>
              <div>
                Payment Method : ${payment.paymentMethod}
              </div>
              ${
                isPaid
                  ? `<div class="success">Paid at ${paidAt}</div>`
                  : `<div class="error">Not Paid</div>`
              }
            </div>
            <div>
              <ul class="cart-list-container">
                <li>
                  <h2>Shopping Cart</h2>
                  <div>Price</div>
                </li>
                ${orderItems
                  .map(
                    (item) => `
                      <li>
                        <div class="cart-image">
                          <img src="${item.image}" alt="${item.name}" />
                        </div>
                        <div class="cart-name">
                          <div>
                            <a href="/#/product/${item.product}">${item.name} </a>
                          </div>
                          <div> Qty: ${item.qty} </div>
                        </div>
                        <div class="cart-price"> $${item.price}</div>
                      </li>
                    `
                  )
                  .join('\n')}
              </ul>
            </div>
          </div>
          <div class="order-action">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li><div>Items</div><div>$${itemsPrice}</div></li>
              <li><div>Shipping</div><div>$${shippingPrice}</div></li>
              <li><div>Tax</div><div>$${taxPrice}</div></li>
              <li class="total"><div>Order Total</div><div>$${totalPrice}</div></li>
              ${
                isPaid && !isDelivered && isAdmin
                  ? `<li><button id="deliver-order-button" class="primary fw">Deliver Order</button></li>`
                  : ''
              }
              <li><button id="send-order-button" class="primary fw">Send Order Data</button></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },
};

export default OrderScreen;
