import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import classes from "./create.module.css";
import { useSelector } from "react-redux"; // 1. Import useSelector

const Create = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [firstImg, setFirstImg] = useState("");
  const [secondImg, setSecondImg] = useState("");
  const [price, setPrice] = useState(0);
  const [stars, setStars] = useState(0);
  const navigate = useNavigate();
  // 2. Get token from Redux store
  const { token } = useSelector((state) => state.auth); 

  const onChangeFileFirst = (e) => {
    setFirstImg(e.target.files[0]);
  };

  const onChangeFileSecond = (e) => {
    setSecondImg(e.target.files[0]);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      const formData2 = new FormData();

      let filename1 = null;
      let filename2 = null;
      if (firstImg && secondImg) {
        filename1 = Date.now() + firstImg.name;
        filename2 = Date.now() + secondImg.name;
        
        formData.append("filename", filename1);
        formData.append("firstImg", firstImg);
        
        formData2.append("filename", filename2);
        formData2.append("secondImg", secondImg);

        // 3. Add Authorization header to Image Uploads
        await fetch(`http://localhost:5003/upload/firstImg`, {
          headers: {
            "Authorization": `Bearer ${token}` // <--- KEY FIX
          },
          method: "POST",
          body: formData,
        });

        await fetch(`http://localhost:5003/upload/secondImg`, {
          headers: {
            "Authorization": `Bearer ${token}` // <--- KEY FIX
          },
          method: "POST",
          body: formData2,
        });
      }

      // 4. Add Authorization header to Product Creation
      const res = await fetch("http://localhost:5003/product", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <--- KEY FIX
        },
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          firstImg: filename1,
          secondImg: filename2,
          price,
          stars,
        }),
      });
      
      const product = await res.json();
      navigate(`/productDetail/${product?._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseImg = (numberImg) => {
     if(numberImg === 'first'){
        setFirstImg(prev => null)
     } else if(numberImg === 'second'){
        setSecondImg(prev => null)
     }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Create product</h2>
        <form onSubmit={handleCreateProduct} encType="multipart/form-data">
          <div className={classes.inputWrapper}>
            <label >Title: </label>
            <input
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              className={classes.input}
              type="text"
              placeholder="title..."
            />
          </div>
          <div className={classes.inputWrapper}>
            <label >Description: </label>
            <input
              name="desc"
              onChange={(e) => setDesc(e.target.value)}
              className={classes.input}
              type="text"
              placeholder="description..."
            />
          </div>
          <div className={classes.inputWrapperImgFirst}>
            <label className={classes.labelFileInput} htmlFor="firstImg" >
              First image: <span>Upload here</span>
            </label>
            <input
              className={classes.input}
              type="file"
              filename="firstImg"
              id="firstImg"
              onChange={onChangeFileFirst}
              placeholder="image..."
              style={{ display: "none" }}
            />
            {firstImg && <p className={classes.imageName}>{firstImg.name} <AiOutlineCloseCircle onClick={() => handleCloseImg('first')} className={classes.closeIcon}/></p>}
          </div>
          <div className={classes.inputWrapperImgSecond}>
            <label className={classes.labelFileInput} htmlFor="secondImg" >
              Second image: <span>Upload here</span>
            </label>
            <input
              className={classes.input}
              type="file"
              filename="secondImg"
              id="secondImg"
              onChange={onChangeFileSecond}
              placeholder="image..."
              style={{ display: "none" }}
            />
            {secondImg && 
               <p className={classes.imageName}>{secondImg.name} <AiOutlineCloseCircle onClick={() => handleCloseImg('second')} className={classes.closeIcon}/></p>
            }
          </div>
          <div className={classes.inputWrapper}>
            <label >Price: </label>
            <input
              step={0.01}
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              className={classes.input}
              type="number"
              placeholder="price..."
            />
          </div>
          <div className={classes.inputWrapper}>
            <label >Stars: </label>
            <input
              min={1}
              max={5}
              step={1}
              name="stars"
              onChange={(e) => setStars(e.target.value)}
              className={classes.input}
              type="number"
              placeholder="stars..."
            />
          </div>
          <div className={classes.buttonWrapper}>
            <button className={classes.submitBtn} type="submit">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;