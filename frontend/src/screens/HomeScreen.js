import axios from "axios";
import Rating from "../components/Rating";
import { hideLoading, showLoading } from "../util";

const HomeScreen = {
  render: async () => {
    showLoading();
    const response = await axios({
      url: "http://localhost:5000/api/products",
      headers: {
        "Content-Type": "application/json",
      },
    });
    hideLoading();

    if (!response || response.statusText != "OK") {
      return "<div>Error getting the data</div>";
    }

    const products = response.data;

    return `
      <div class="carousel-container">
      <div class="carousel">
        <div class="carousel-slide">
          <div class="carousel-item"><img src="/images/car-image1.jpg" alt="Product 1"></div>
          <div class="carousel-item"><img src="/images/car-image2.jpg" alt="Product 2"></div>
          <div class="carousel-item"><img src="/images/car-image3.jpg" alt="Product 3"></div>
          <div class="carousel-item"><img src="/images/car-image4.jpg" alt="Product 4"></div>
          <!-- Add more carousel items with images -->
        </div>
    
        <!-- Previous and Next buttons -->
        <div class="carousel-controls">
          <button class="carousel-button prev" onclick="prevSlide()">Previous</button>
          <button class="carousel-button next" onclick="nextSlide()">Next</button>
        </div>
      </div>
    </div>
    <div id center-div-section>
    <h1>
      .
    </h1>
    </div>
          <ul class="products">
          ${products
            .map(
              (product) => `
            <li>
              <div class="product">

                <a href="/#/product/${product._id}">
                  <img src="${product.image}" alt="${product.name}" />
                </a>
  
                <div class="product-name">
                  <a href="/#/product/${product._id}">
                  ${product.name}
                  </a>
                </div>

                <div class = "product-rating">
                    ${Rating.render({ value: product.rating, text: `${product.numReviews} reviews` })}
                </div>
  
                <div class="product-brand">${product.brand}
                </div>
  
                <div class="product-price">
                  ${product.price}
                </div>

              </div>
            </li>
          `
            )
            .join("")}
          </ul>
      `;
  },

  after_render() {
    // No functionality needed here
  },
};

export default HomeScreen;
