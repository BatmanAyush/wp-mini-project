import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyCart } from "../../redux/cartSlice"; 
import classes from "./checkout.module.css";

const Checkout = () => {
  const { address } = useSelector((state) => state.address);
  const { products } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPriceProducts = () => {
    let totalPrice = 0;
    products.forEach((product) => {
        totalPrice += product.price * product.quantity;
    });
    return totalPrice.toFixed(2);
  };

  const handleOrder = async () => {
    console.log("Current Cart Products:", products);

    // 1. Map cart items to the structure the backend expects
    // We map 'id' (from Redux) to 'productId' (for Mongoose)
    const orderItems = products.map((item) => ({
      productId: item.id, 
      title: item.title,
      vendorId: item.vendorId,
      img: item.mainImg,
      price: item.price,
      quantity: item.quantity
    }));

    console.log("SENDING ORDER ITEMS:", orderItems);

    try {
      // Use the environment variable for the URL
      const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5003";
      const res = await fetch(`${baseUrl}/order`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          products: orderItems,
          address,
          amount: totalPriceProducts(),
        }),
      });

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg?.message || "Order failed");
      }

      // Success!
      dispatch(emptyCart());
      navigate("/final");
    } catch (error) {
      console.error("Order Error:", error);
    }
  };

  // Helper to get correct image URL
  const getImageUrl = (imgName) => {
      if (!imgName) return "";
      if (imgName.startsWith("http")) return imgName;
      const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5003";
      return `${baseUrl}/images/${imgName}`;
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <h1 className={classes.title}>Address Data</h1>
          <div className={classes.addressData}>
            {address && Object.entries(address).map(([key, value]) => (
              <div className={classes.info} key={key}>
                <h3>{key}: </h3>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.bottom}>
          <h1 className={classes.title}>Products</h1>
          <div className={classes.products}>
            {products.map((product) => (
              <div key={product.id} className={classes.product}>
                <img
                  src={getImageUrl(product.mainImg)}
                  className={classes.img}
                  alt={product.title}
                />
                <div className={classes.priceAndTitle}>
                  <p className={classes.productTitle}>{product.title}</p>
                  <span className={classes.price}>
                    {product.quantity} x <span>$</span> {Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className={classes.totalPriceMsg}>
            Total price of products:{" "}
            <div className={classes.totalPrice}>${totalPriceProducts()}</div>
          </span>
        </div>
        
        <button onClick={handleOrder} className={classes.orderBtn}>
          Order Now
        </button>
      </div>
    </div>
  );
};

export default Checkout;