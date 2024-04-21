import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Webcam from "react-webcam";
import "./style.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ClipLoader } from "react-spinners";
import styled, { keyframes } from "styled-components";
import { pulse } from "react-animations";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";


function App() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [img, setImg] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [aspect, setAspect] = useState(1 / 1);
  const [facing, setFacing] = useState("user");
  const [isCaptured, setIsCaptured] = useState(false);

  // const { zoomIn, zoomOut, resetTransform } = useControls();

  const url = "https://imagecapture.onrender.com";
  let imageSrc;
  const capture = () => {
    setIsCaptured(true);
    // Play shutter sound
    const shutterSound = new Audio("/shutter-sound.mp3");
    shutterSound.play();
    setTimeout(() => setIsCaptured(false), 1000);
    imageSrc = webcamRef.current.getScreenshot();
    const formData = new FormData();
    formData.append("image", JSON.stringify(imageSrc));
    axios
      .post(`${url}/storeimage`, formData)
      .then(() => {
        console.log("stored");
        axios
          .get(`${url}/view-gallery`)
          .then((res) => {
            console.log("res", res);
            setImg(res.data.images);
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .catch((err) => {
        console.log("error in storing", err);
      });
  };

  const CameraSettings = styled.div`
  position: absolute;
    top: 0;
    left: 0;
    margin-top:-55px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;     
    animation: 0.6s ${keyframes`${pulse}`};
    // transform: translate(-50%, -50%);
  `;

  const loadGallery = async () => {
    axios
      .get(`${url}/view-gallery`)
      .then((res) => {
        console.log("res", res);
        setImg(res.data.images);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setIsLoading(true);
      });
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleViewMore = () => {
    navigate("/gallery", { images: img });
  };


  const handleDelete = async (id) => {
    let val = await confirm("Do you want to delete the picture ?");
    if (val == true) {
      axios
        .get(`${url}/delete-image/${id}`)
        .then((res) => {
          if (res.status == 200) {
            console.log("res", res);
            toast.success(res.data.message);
            loadGallery();
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  const Buttons = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
   
    const handleAspect = async (val) => {
      console.log('val',val);
      if (val == 16 / 9) {
        document.getElementById("dropdownMenuButton").innerText = "16:9";
      } else if (val == 4 / 3) {
        document.getElementById("dropdownMenuButton").innerText = "4:3";
      }
      if (val == 1 / 1) {
        document.getElementById("dropdownMenuButton").innerText = "1:1";
      }
      setAspect(val);
    };
  
    const handleFacing = async () => {
      if (facing === "environment") {
        setFacing("user");
      } else {
        setFacing("environment");
      }
    };
  
  
    return (
      <>
      <div className="form-inline button-group mt-3">
        <button className='all-buttons' onClick={() => zoomIn()}>+</button>&nbsp;
        <button className='all-buttons' onClick={() => zoomOut()}>-</button>&nbsp;
        <button className='all-buttons' onClick={() => resetTransform()}>x</button>
        <div class="dropdown ml-2">
                <button
                  class="all-buttons dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Aspect Ratio
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" onClick={() => handleAspect(16 / 9)}>
                    16:9
                  </a>
                  <a class="dropdown-item" onClick={() => handleAspect(4 / 3)}>
                    4:3
                  </a>
                  <a class="dropdown-item" onClick={() => handleAspect(1 / 1)}>
                    1:1
                  </a>
                </div>
              </div>
              <button className="all-buttons ml-2" onClick={handleFacing}>
                <i class="fa-solid fa-camera-rotate"></i>
              </button>              
      </div>
      <button onClick={capture} className="all-buttons mt-3">
      Capture
    </button>
    </>
    );
  };


  return (
    <div className="fluid-container text-center">
      <Navbar />
      {isLoading ? (
        <ClipLoader color={"#123abc"} loading={isLoading} size={70} />
      ) : (
        <>        
          <h1 className="mb-5">Capture Your Image</h1>
          <div  >
            <TransformWrapper >
              <div className="canvas">            
              <TransformComponent >
              <Webcam
              audio={false}
              ref={webcamRef}      
              className="webcam-container"                                                                                                     
              videoConstraints={{                
                aspectRatio: aspect,
                facingMode: { exact: `${facing}` }                
              }}
            />
              </TransformComponent>
              <Buttons/>
              </div>
            </TransformWrapper>
            
            {isCaptured && (
              <CameraSettings>
                <Webcam                 
                style={{ width: `${300 * zoomLevel}px`, height: `${200 * zoomLevel}px` }}
                videoConstraints={{                  
                  aspectRatio: aspect,
                  facingMode: { exact: `${facing}` },
                }}/>               
              </CameraSettings>
            )}
          </div>
          {/* <div className="form-inline button-group">           
          </div> */}
          

          <div className="mt-3 mb-3">
            {img.length > 0 &&
              img
                .slice(-4)
                .reverse()
                .map((x, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      key={index}
                      src={x.imageString}
                      height="100px"
                      width="150px"
                      className="image-box"
                    />
                    <i
                      class="fa-solid fa-trash delete-icon"
                      onClick={() => handleDelete(x._id)}
                    ></i>
                  </div>
                ))}
          </div>
          {img.length > 0 && (
            <button className="mb-5 all-buttons" onClick={handleViewMore}>
              View More
            </button>
          )}        
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
