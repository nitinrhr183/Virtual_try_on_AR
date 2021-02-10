import { Box } from "drei";
import React from "react";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader, useFrame } from "react-three-fiber";
import * as THREE from "three";

function Image(props) {
  console.log("MODELDIST______", props.distance);
  // if (props.neck) {
  //   //For ears
  //   // if (props.distance < 100) {
  //   //   props.position[1] += 25;
  //   //   props.scale[0] = 10;
  //   //   props.scale[1] = 10;
  //   //   props.scale[2] = 10;
  //   // } else if (props.distance > 100 && props.distance < 130) {
  //   //   props.position[1] += 17;
  //   //   props.scale[0] = 15;
  //   //   props.scale[1] = 15;
  //   //   props.scale[2] = 15;
  //   // }
  // } else {
  //   //For neck
  //   if (props.distance < 70) {
  //     console.log("--70--HH");
  //     props.position[1] += 80;
  //     props.scale[0] = 1000;
  //     props.scale[1] = 1000;
  //     props.scale[2] = 1000;
  //   } else if (props.distance < 100) {
  //     console.log("--100--HH");
  //     props.position[1] += 65;
  //     props.scale[0] = 1300;
  //     props.scale[1] = 1300;
  //     props.scale[2] = 1300;
  //   } else if (props.distance < 115) {
  //     console.log("--115--HH");
  //     props.position[1] += 55;
  //     props.scale[0] = 1600;
  //     props.scale[1] = 1600;
  //     props.scale[2] = 1600;
  //   } else if (props.distance > 115 && props.distance < 135) {
  //     console.log("--115-135--HH");
  //     props.position[1] += 35;
  //     props.scale[0] = 1900;
  //     props.scale[1] = 1900;
  //     props.scale[2] = 1900;
  //   } else if (props.distance > 135 && props.distance < 155) {
  //     console.log("--115-135--HH");
  //     props.position[1] += 10;
  //     props.scale[0] = 2200;
  //     props.scale[1] = 2200;
  //     props.scale[2] = 2200;
  //   } else if (props.distance > 155 && props.distance < 200) {
  //     props.position[1] += 13;
  //     props.scale[0] = 2500;
  //     props.scale[1] = 2500;
  //     props.scale[2] = 2500;
  //   } else if (props.distance > 200) {
  //     props.position[1] -= 30;
  //     props.scale[0] = 3000;
  //     props.scale[1] = 3000;
  //     props.scale[2] = 3000;
  //   }
  // }
  return (
    <mesh {...props}>
      <planeGeometry attach="geometry" args={[10, 7.5]} />
      <meshLambertMaterial attach="material" map={props.texture} />
    </mesh>
  );
}

export default Image;
