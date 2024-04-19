import { useEffect, useState } from "react";
import {toast} from 'react-toastify';
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ClipLoader } from 'react-spinners';

function Gallery() {
  const url = "https://imagecapture.onrender.com";
  const [img, setImg] = useState([]);
  const [isLoading,setIsLoading] = useState();
  const loadGallery = async()=>{
    setIsLoading(true)
    axios
    .get(`${url}/view-gallery`)
    .then((res) => {
      console.log("res", res);
      setIsLoading(false)
      setImg(res.data.images);
    })
    .catch((err) => {
      setIsLoading(false)
      console.log("err", err);
    });
  }
  
    useEffect(() => {
      loadGallery()
    }, []);
  

  const handleDelete = async(id)=>{
    let val = await confirm('Do you want to delete the picture ?')
    if(val == true){
    axios.get(`${url}/delete-image/${id}`)
    .then((res)=>{
      if(res.status == 200){
        console.log('res',res);
        toast.success(res.data.message)
        loadGallery();
      }
    }).catch((err)=>{
      toast.error(err.response.data.message)
    })
    }
    }

  return (
    <div className="fluid-container text-center">
      <Navbar/>
      {isLoading ? 
      <ClipLoader color={'#123abc'} loading={isLoading} size={70} /> :
      <>
      <div className="gallery">
      <h1 className="text-center">Image Gallery</h1>
      <div className="mt-4 mb-3">
        {img.length > 0 &&
          img
            .slice()
            .reverse()
            .map((x, index) => (
              <div
                key={index}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={x.imageString}
                  height="100px"
                  width="150px"
                  className="image-box"
                  alt={`Image ${index + 1}`}
                />
                <i class="fa-solid fa-trash delete-icon" onClick={()=>handleDelete(x._id)}></i>
              </div>

              // <img
              //   key={index}
              //   src={x.imageString}
              //   height="100px"
              //   width="150px"
              //   className="image-box"
              // />
            ))}
      </div>
      </div>      
      <Footer/>
      </>
}
    </div>
  );
}

export default Gallery;
