import React from 'react'
import { Link } from 'react-router-dom'
import classes from './productCard.module.css'

const ProductCard = ({ product }) => {
  // Determine the correct image URL
  // If product.firstImg starts with 'http', use it as is.
  // Otherwise, prepend the backend URL.
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5003";
  
  const imageUrl = product.firstImg?.startsWith("http")
    ? product.firstImg
    : `${baseUrl}/images/${product.firstImg}`;

  return (
    <div className={classes.container}>
        <Link to={`/productDetail/${product._id}`} className={classes.wrapper}>
            <div className={classes.imgContainer}>
                <img 
                    src={imageUrl} 
                    className={classes.productImg} 
                    alt={product.title} 
                    onError={(e) => {e.target.src = "https://via.placeholder.com/150"}} // Fallback image
                />
            </div>
            <div className={classes.productInfo}>
              <h2 className={classes.productTitle}>{product.title}</h2>
              <div className={classes.priceAndStars}>
                  <span className={classes.productPrice}><span>$</span>{Number(product?.price).toFixed(2)}</span>
                  {/* Add stars or other info here if needed */}
              </div>
            </div>
        </Link>
    </div>
  )
}

export default ProductCard