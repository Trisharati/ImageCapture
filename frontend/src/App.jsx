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
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

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

  const capture = () => {
    setIsCaptured(true);
    setTimeout(() => setIsCaptured(false), 1000);

    const imageSrc = webcamRef.current.getScreenshot();
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
    margin-top: -55px;
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

  // Function to handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => {
      console.log('prev',prevZoom);      
      if(window.innerWidth>=1280){
        return Math.min((prevZoom + 0.1).toFixed(1), 1.4);
      }
      else if(window.innerWidth>=1024){
        return Math.min((prevZoom + 0.1).toFixed(1), 1.4);
      }
      else if(window.innerWidth>=768){
        return Math.min((prevZoom + 0.1).toFixed(1), 1.2  );
      }
      else if(window.innerWidth>=415 && window.innerWidth <= 767){
        return Math.min((prevZoom + 0.1).toFixed(1), 1.2  );
      }
      else if(window.innerWidth<=414){
        return Math.min((prevZoom + 0.1).toFixed(1), 2);
      }
      
    });
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => {
      return Math.max((prevZoom - 0.1).toFixed(1), 0.6);
    });
  };

  const handleAspect = async (val) => {
    console.log("val", val);
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
    <div className="fluid-container text-center">
      <Navbar />
      {isLoading ? (
        <ClipLoader color={"#123abc"} loading={isLoading} size={70} />
      ) : (
        <>
          <h1 className="mb-5">Capture Your Image</h1>
          <div >
            <Webcam
              audio={false}
              ref={webcamRef}
              className="webcam-container"
              style={{                 
                transform: `scale(${zoomLevel})`,
              }}
              videoConstraints={{
                aspectRatio: aspect,
                facingMode: { exact: `${facing}` },
              }}
            />
            {isCaptured && (
              <CameraSettings>
                <Webcam
                  style={{
                    width: `${window.innerWidth * 0.5 * zoomLevel}px`,
                    height: `${window.innerHeight * 0.5 * zoomLevel}px`,
                    marginLeft: `${window.innerWidth * 0.25}px`,
                    marginRight: `${window.innerWidth * 0.25}px`,
                  }}
                  videoConstraints={{
                    aspectRatio: aspect,
                    facingMode: { exact: `${facing}` },
                  }}
                />
              </CameraSettings>
            )}
          </div>
          <div className="form-inline button-group mt-5">
            <button
              onClick={handleZoomIn}
              className="all-buttons"
              tabIndex={0}
              type="button"
            >
              <i class="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            <button
              onClick={handleZoomOut}
              className="all-buttons ml-2"
              tabIndex={0}
              type="button"
            >
              <i class="fa-solid fa-magnifying-glass-minus"></i>
            </button>
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
