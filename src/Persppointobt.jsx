import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import "./App.css";
import * as bodypix from "@tensorflow-models/body-pix";
import * as bb from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { OrbitControls } from "drei";
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Model from "./Model";

let xl, xr, yr, yl;
let points = { xl: 0, xr: 0, yl: 0, yr: 0 };

function set(x, y, ear) {
  if (ear == 1) {
    //right ear
    points = { ...points, xr: x, yr: y };
    //let { xr, yr } = points;
    //console.log("Right xr,yr=====", xr, yr);
  } else if (ear == 2) {
    points = { ...points, xl: x, yl: y };
    // let { xl, yl } = points;
    // console.log("Left xl,yl=====", xl, yl);
  }
}

function Persppointobt(props) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [leftpoints, setlpoints] = useState([false]);
  const [rightpoints, setrpoints] = useState([false]);
  const [neckpoints, setnpoints] = useState([false]);

  const [distance, setdistance] = useState(0);

  useEffect(() => {
    runPosenet();
  }, []);

  const runPosenet = async () => {
    const net = await bodypix.load();
    //
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      // const videoWidth = webcamRef.current.video.videoWidth;
      // const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = 640;
      webcamRef.current.video.height = 480;

      // Make Detections
      const pose = await net.segmentPerson(video);
      if (pose && pose.allPoses && pose.allPoses.length > 0) {
        drawCanvas(pose, canvasRef);
      }
    }
  };

  const drawCanvas = (pose, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = 640;
    canvas.current.height = 480;
    //distance--
    if (pose.allPoses[0].keypoints[4]["score"] * 100 > 70.0) {
      //right ear
      const xR = pose.allPoses[0].keypoints[4].position.x + 10;
      let yR = pose.allPoses[0].keypoints[4].position.y;
      yR = yR + 20;
      // console.log("Right ear x=", xR);
      //console.log("Right ear y=", yR);
      set(xR, yR, 1);

      setrpoints(transform(xR, yR, 1));
    } else {
      set(0, 0, 1);
      setrpoints(false);
    }
    if (pose.allPoses[0].keypoints[3]["score"] * 100 > 70.0) {
      //left ear
      const xL = pose.allPoses[0].keypoints[3].position.x - 5;
      const yL = pose.allPoses[0].keypoints[3].position.y + 27;
      // console.log("Left ear x=", xL);
      // console.log("Left ear y=", yL);

      set(xL, yL, 2);

      setlpoints(transform(xL, yL, 2));
    } else {
      set(0, 0, 2);
      setlpoints(false);
    }

    if (
      pose.allPoses[0].keypoints[5]["score"] * 100 > 50.0 &&
      pose.allPoses[0].keypoints[6]["score"] * 100 > 40.0
    ) {
      //neck point
      const x =
        (pose.allPoses[0].keypoints[5].position.x +
          pose.allPoses[0].keypoints[6].position.x) /
        2;
      const y =
        (pose.allPoses[0].keypoints[5].position.y +
          pose.allPoses[0].keypoints[6].position.y) /
        2;

      setnpoints(transform(x, y + 90, 3));
    } else {
      setnpoints(false);
    }
  };

  const transform = (videox, videoy, obj) => {
    const k = videox - 640 / 2;
    const l = videoy - 480 / 2;

    if (points.xl == 0 && points.yl == 0) {
      console.log("NO LEFT EAR");
      //distance bw neck and right point
    } else if (points.xr == 0 && points.yr == 0) {
      console.log("No Right ear");
      //distance bw neck and left point
    } else {
      console.log("Both ears");
      const a = points.xr - points.xl;
      const b = points.yr - points.yl;
      const dist = Math.sqrt(a * a + b * b);
      setdistance(dist);
      // console.log("Distance=", distance);
    }

    return [-k, -l - 40, -50]; // position passed to render object
  };

  const gltfleft = useLoader(GLTFLoader, props.leftEarring);
  const gltfright = useLoader(GLTFLoader, props.rightEarring);
  const gltfneck = useLoader(GLTFLoader, props.necklace);
  //

  //
  const webcam_style = {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
    zindex: 9,
    width: 640,
    height: 480,
  };
  const canvas_style = {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
    zindex: 9,
    width: 640,
    height: 480,
    transform: "rotateY(180deg)",
  };
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          className="Webcamstyle"
          ref={webcamRef}
          mirrored={true}
          style={webcam_style}
        />

        <canvas ref={canvasRef} style={canvas_style}>
          {" "}
        </canvas>
        <div className="divcanvas">
          <Canvas
            id="canvid"
            style={{
              width: 640,
              height: 480,
            }}
            pixelRatio={undefined}
            camera={{ position: [0, 0, 245] }}
          >
            <ambientLight intensity={1} />
            <spotLight position={[100, 100, 2000]} angle={0.15} />

            {rightpoints && gltfleft && (
              <Model
                position={rightpoints}
                scale={[20, 20, 20]}
                scene={gltfleft.scene}
                distance={distance}
                neck={true}
              />
            )}

            {leftpoints && gltfright && (
              <Model
                position={leftpoints}
                scale={[20, 20, 20]}
                scene={gltfright.scene}
                distance={distance}
                neck={true}
              />
            )}
            {neckpoints && gltfneck && (
              <Model
                position={neckpoints}
                scale={[2500, 2500, 2500]}
                scene={gltfneck.scene}
                distance={distance}
                neck={false}
              />
            )}

            <OrbitControls
              enableZoom={true}
              enablePan={true}
              //   enableRotate={true}
            />
          </Canvas>
        </div>
      </header>
    </div>
  );
}

export default Persppointobt;
