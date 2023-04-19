import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ ImageUrl, box }) => {
    return (
      <div className="center">
        <div className="absolute mt3">
          <img id="Image" alt="" src={ImageUrl} width="500px" height="auto" />
          {box &&
            box.map((boundingBox, index) => {
              return (
                <div
                  key={index}
                  className="bounding-box"
                  style={{
                    top: boundingBox.topRow,
                    right: boundingBox.rightCol,
                    bottom: boundingBox.bottomRow,
                    left: boundingBox.leftCol,
                  }}
                ></div>
              );
            })}
        </div>
      </div>
    );
  };
  

export default FaceRecognition;