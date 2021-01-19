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

// function Dolly(props) {
//   useFrame(({ camera }) => {
//     // const calcScale = video.correctScale;
//     // console.log("calcScale", calcScale);
//     //console.log("a=", camera);
//     // props.getPosition(camera);
//     // camera.position.z = 50 + Math.sin(clock.getElapsedTime()) * 30;
//   });
//   return null;
// }

// function useLoadObj(obj) {
//   const gltfleft = useLoader(GLTFLoader, "earring.glb");
//   console.log(obj);
// }

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
      const x = pose.allPoses[0].keypoints[4].position.x;
      let y = pose.allPoses[0].keypoints[4].position.y;

      y = y + 27;
      // console.log("Right ear x=", x);
      // console.log("Right ear y=", y);
      setrpoints(transform(x, y, 1));

      // const a = pose.allPoses[0].keypoints[4].position.x;
      // const b = pose.allPoses[0].keypoints[4].position.y;
      ctx.beginPath();

      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      // ctx.arc(a, b, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    } else {
      setrpoints(false);
    }
    if (pose.allPoses[0].keypoints[3]["score"] * 100 > 70.0) {
      //left ear
      const x = pose.allPoses[0].keypoints[3].position.x - 5;
      const y = pose.allPoses[0].keypoints[3].position.y + 27;
      // console.log("Left ear x=", x);
      // console.log("Left ear y=", y);
      setlpoints(transform(x, y, 2));

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);

      ctx.fillStyle = "red";
      ctx.fill();
      //x,y--
    } else {
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

  const transform = (videox, videoy, obj) => {
    const k = videox - 640 / 2;
    const l = videoy - 480 / 2;
    //
    //distance..ear..
    console.log("k,l=", k, l);
    return [-k, -l, 10]; // position passed to render object
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
  //(x1,y1)left...right(x2,y2)
  // var a = x1 - x2;
  // var b = y1 - y2;
  // var c = Math.sqrt(a * a + b * b);
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

            {/* <Suspense fallback={false}> */}
            {/* <Image scale={[10, 10, 10]} position={[100, 1, 10]} /> */}
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