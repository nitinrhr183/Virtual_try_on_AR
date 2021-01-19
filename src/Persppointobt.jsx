import React, { useRef, useState, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import "./App.css";
import * as bodypix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { ContactShadows, Environment, useGLTF, OrbitControls } from "drei";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Model from "./Model";
import Image from "./Image";

let xl, xr, yr, yl;
let points = { xl: 0, xr: 0, yl: 0, yr: 0 };

function set(x, y, ear) {
  if (ear == 1) {
    //right ear
    points = { ...points, xr: x, yr: y };
    let { xr, yr } = points;
    // xr = xR;
    // yr = yR;
    console.log("Right xr,yr=====", xr, yr);
  } else if (ear == 2) {
    points = { ...points, xl: x, yl: y };
    let { xl, yl } = points;
    // xr = xR;
    // yr = yR;
    console.log("Left xl,yl=====", xl, yl);
  }
}

function Persppointobt() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const width = 640;
  const height = 480;
  const camera_position = { position: [0, 0, 7] };
  var mouse = {};
  var earthMesh, tmpMesh;
  let cameraObj = {};

  const [leftpoints, setlpoints] = useState([0, 0, 0]);
  const [rightpoints, setrpoints] = useState([0, 0, 0]);
  const [neckpoints, setnpoints] = useState([0, 0, 0]);

  const [distance, setdistance] = useState(0);
  const [rightear, setRightear] = useState();

  const objects3D = [
    { glb: "sceneneck", neckpt: "-50" },
    { glb: "earring", neckpt: "-50" },
  ];

  useEffect(() => {
    //initPlane();
    runPosenet();
  }, []);

  const runPosenet = async () => {
    const net = await bodypix.load();
    //
    setInterval(() => {
      detect(net);
    }, 100);
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
      // const pose = await net.segmentPerson(video);
      const pose = await net.segmentPerson(video);
      // console.log(pose.allPoses[0].keypoints[3]["score"]);
      // console.log(pose);

      drawCanvas(pose, canvasRef);
    }
  };

  const drawCanvas = (pose, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = 640;
    canvas.current.height = 480;
    if (pose.allPoses[0].keypoints[4]["score"] * 100 > 70.0) {
      //right ear
      const xR = pose.allPoses[0].keypoints[4].position.x;
      let yR = pose.allPoses[0].keypoints[4].position.y;
      yR = yR + 27;
      console.log("Right ear x=", xR);
      console.log("Right ear y=", yR);
      set(xR, yR);
      // setRightear(xR);

      // console.log("Right ear x=", x);
      // console.log("Right ear y=", y);
      //setdistance;
      setrpoints(transform(xR, yR, 1)); //return[k,l,10]
      // const a = pose.allPoses[0].keypoints[4].position.x;
      // const b = pose.allPoses[0].keypoints[4].position.y;
      ctx.beginPath();

      ctx.arc(xR, yR, 4, 0, 2 * Math.PI);
      // ctx.arc(a, b, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    } else {
      set(0, 0);
      setrpoints(false);
    }
    if (pose.allPoses[0].keypoints[3]["score"] * 100 > 70.0) {
      //left ear
      const xL = pose.allPoses[0].keypoints[3].position.x - 5;
      const yL = pose.allPoses[0].keypoints[3].position.y + 27;
      // console.log("Left ear x=", x);
      // console.log("Left ear y=", y);

      set(xL, yL);

      setlpoints(transform(xL, yL, 2));

      ctx.beginPath();
      ctx.arc(xL, yL, 4, 0, 2 * Math.PI);

      ctx.fillStyle = "red";
      ctx.fill();
      //x,y--
    } else {
      set(0, 0);
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
      //console.log("NEck--", x, y);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      // ctx.arc(a, b, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      //x,y--
    } else {
      setnpoints(false);
    }
  };

  //(xL,yL)left...right(xR,yR)
  // var a = xR - xL;
  // var b = yR - yL;
  // var distance = Math.sqrt(a * a + b * b);
  const transform = (videox, videoy, obj) => {
    //right......//left,distance()
    const k = videox - 640 / 2;
    const l = videoy - 480 / 2;
    //xl,yl;
    //xr,yr
    // var a = xR - xL;
    // var b = yR - yL;
    // var distance = Math.sqrt(a * a + b * b);

    console.log("===", rightear);
    console.log("///", rightpoints);

    //
    //distance=(left-right)
    return [-k, -l - 40, 10]; // position passed to render object
  };

  //
  // let leftx, lefty, rightx, righty, distance;

  // if (obj == 1) {
  //   //left ear..
  //   console.log("LEFT k,l=", k, l);
  //   leftx = k;
  //   lefty = l;
  //   console.log("Leftx ,lefty=", leftx, lefty);
  //   return [-k, -l - 40, 10];
  // }
  // if (obj == 2) {
  //   console.log("RIGHT k,l=", k, l);
  //   //right ear
  //   //distance=left-right
  //   return [-k, -l - 40, 10];
  // }
  // console.log("k,l=", k, l);
  //necklace
  const gltfleft = useLoader(GLTFLoader, "earring.glb");
  const gltfright = useLoader(GLTFLoader, "earring2.glb");
  const gltfneck = useLoader(GLTFLoader, "sceneneck.glb");
  //

  //
  // const positionData = (data) => {
  //   cameraObj = data;
  // };
  //   const findObj = (file) => {
  //     const obj = objects3D.find((value) => value.glb === file);
  //     //const gltfleft = useLoader(GLTFLoader, "earring.glb");
  //     //useLoadObj(obj);
  //     console.log("AA", obj);
  //   };

  return (
    <div className="App">
      {/* <Suspense fallback={null}> */}
      <header className="App-header">
        {/* <button onClick={() => findObj("sceneneck1")}>SelectObject</button> */}

        <Webcam
          className="Webcamstyle"
          ref={webcamRef}
          mirrored={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
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
          }}
        >
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
            camera={{ position: [0, 0, 320] }}
          >
            {/* <THREE.Vector3 id="vect" position={(mouse.x, mouse.y, 0.0)} /> */}
            {/* <ambientLight intensity={0.3} />

            <pointLight
              intensity={1}
              angle={0}
              penumbra={1}
              position={[0, 0, 2000]}
            /> */}
            <ambientLight intensity={1} />
            <spotLight position={[100, 100, 2000]} angle={0.15} />

            {/* <Suspense fallback={null}> */}
            {rightpoints && gltfleft && (
              <Model
                position={rightpoints}
                scale={[20, 20, 20]}
                scene={gltfleft.scene}
              />
            )}
            {leftpoints && gltfright && (
              <Model
                position={leftpoints}
                scale={[20, 20, 20]}
                scene={gltfright.scene}
              />
            )}
            {neckpoints && gltfneck && (
              <Model
                position={neckpoints}
                scale={[2500, 2500, 2500]}
                scene={gltfneck.scene}
              />
            )}
            {/* <Image scale={[0.5, 0.5, 0.5]} position={[1, 1, 1]} /> */}

            {/* </Suspense> */}
            {/* <Dolly getPosition={positionData} /> */}
            <OrbitControls
              //   enableZoom={true}
              enablePan={true}
              //   enableRotate={true}
            />
          </Canvas>
        </div>
      </header>
      {/* </Suspense> */}
    </div>
  );
}

export default Persppointobt;
