import HomeScreen from "./screens/HomeScreen.js";
import ProductScreen from './screens/ProductScreen.js';
import Error404Screen from "./screens/Error404Screen.js";
import { parseRequestUrl }  from "./util.js";
import CartScreen from "./screens/CartScreen.js";
import SigninScreen from "./screens/signInScreen.js";
import Header from "./components/Header.js";
import RegisterScreen from "./screens/RegisterScreen.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import ShippingScreen from "./screens/ShippingScreen.js";
import PaymentScreen from "./screens/PaymentScreen.js";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.js";
import OrderScreen from "./screens/OrderScreen.js";


const routes = {
    "/": HomeScreen,
    "/product/:id": ProductScreen,
    "/order/:id": OrderScreen,
    "/cart/:id": CartScreen,
    "/cart": CartScreen,
    "/signin": SigninScreen,
    "/register": RegisterScreen,
    "/profile": ProfileScreen,
    "/shipping": ShippingScreen,
    "/payment": PaymentScreen,
    "/placeorder": PlaceOrderScreen,
};


const router = async() =>{

    const request = parseRequestUrl();

    const parseUrl = (request.resource ? `/${request.resource}` : '/') + 
    (request.id ? '/:id': '') + 
    (request.verb ? `/${request.verb}`:'');

    const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
    const header = document.getElementById('header-container');
    header.innerHTML = await Header.render();
    await Header.after_render();

    const main = document.getElementById("main-container");
    main.innerHTML = await screen.render();
    if(screen.after_render) await screen.after_render();
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);