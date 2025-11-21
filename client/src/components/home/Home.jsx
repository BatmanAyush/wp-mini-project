import React, { useEffect, useState } from "react";
import List from "../list/List";
import classes from "./home.module.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5003";
        const res = await fetch(`${baseUrl}/product`);
        
        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        console.log("Fetched Products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className={classes.loading}>Loading products...</div>;

  return (
    <div className={classes.container}>
      {!error && products.length > 0 ? (
        <List products={products} />
      ) : (
        <h1 className={classes.noProducts}>
            {error ? "Error loading products." : "No products found."}
        </h1>
      )}
    </div>
  );
};

export default Home;