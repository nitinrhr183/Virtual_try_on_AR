import React, { useRef } from "react";
import DemoScene, { Camera } from "three";
import { ReactThreeFiber, useFrame } from "react-three-fiber";

const Model = (props) => {
  const primitiveRef = useRef();
  // console.log("...", props.l);
  useFrame(() => {
    //console.log(Camera);
    // console.log(primitiveRef.current.position);
    // console.log(primitiveRef.current.scale.set);
    // const calcScale = video.correctScale
    // const calcScale = 10;
    //primitiveRef.current.scale.set(calcScale, calcScale, calcScale);
    // const x = (props.scale[0] = 100);
    // const y = (props.scale[1] = 100);
    // const z = (props.scale[2] = 100);
    //console.log(props.scale);
    // console.log("--", primitiveRef.current.scale);
  });
  return <primitive ref={primitiveRef} {...props} object={props.scene} />;
};

export default Model;
