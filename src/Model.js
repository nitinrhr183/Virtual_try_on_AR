import React, { useRef } from "react";

const Model = (props) => {
  const primitiveRef = useRef();
  console.log("MODELDIST______", props.distance);
  if (props.neck) {
    //For ears
    if (props.distance < 100) {
      props.position[1] += 25;
      props.scale[0] = 10;
      props.scale[1] = 10;
      props.scale[2] = 10;
    } else if (props.distance > 100 && props.distance < 130) {
      props.position[1] += 17;
      props.scale[0] = 15;
      props.scale[1] = 15;
      props.scale[2] = 15;
    }
  } else {
    //For neck
    if (props.distance < 70) {
      props.position[1] += 80;
      props.scale[0] = 1000;
      props.scale[1] = 1000;
      props.scale[2] = 1000;
    } else if (props.distance < 100) {
      console.log("AAAA");
      props.position[1] += 65;
      props.scale[0] = 1300;
      props.scale[1] = 1300;
      props.scale[2] = 1300;
    } else if (props.distance < 115) {
      props.position[1] += 55;
      props.scale[0] = 1600;
      props.scale[1] = 1600;
      props.scale[2] = 1600;
    } else if (props.distance > 115 && props.distance < 135) {
      props.position[1] += 35;
      props.scale[0] = 1900;
      props.scale[1] = 1900;
      props.scale[2] = 1900;
    } else if (props.distance > 135 && props.distance < 155) {
      props.position[1] += 10;
      props.scale[0] = 2200;
      props.scale[1] = 2200;
      props.scale[2] = 2200;
    } else if (props.distance > 155 && props.distance < 200) {
      props.position[1] += 13;
      props.scale[0] = 2500;
      props.scale[1] = 2500;
      props.scale[2] = 2500;
    } else if (props.distance > 200) {
      props.position[1] -= 30;
      props.scale[0] = 3000;
      props.scale[1] = 3000;
      props.scale[2] = 3000;
    }
  }

  return <primitive ref={primitiveRef} {...props} object={props.scene} />;
};

export default Model;

//////////////////////
// props.position[1] += 10;
// primitiveRef.current.position.set(
//   primitiveRef.current.position.x,
//   primitiveRef.current.position.y + 10,
//   primitiveRef.current.position.z
// );
// primitiveRef.current.scale.set(10, 10, 10);

////////////////////////
// useFrame(() => {
//   //console.log(Camera);
//   // console.log(primitiveRef.current.position);
//   // console.log(primitiveRef.current.scale);
//   // const calcScale = video.correctScale
//   // const calcScale = 10;
//   console.log(".....", primitiveRef.current.position.y);
//   primitiveRef.current.position.set(
//     primitiveRef.current.position.x,
//     primitiveRef.current.position.y + 10,
//     primitiveRef.current.position.z
//   );
//   primitiveRef.current.scale.set(10, 10, 10);
//   // const x = (props.scale[0] = 100);
//   // const y = (props.scale[1] = 100);
//   // const z = (props.scale[2] = 100);
//   // console.log("MODELDIST______", props.distance);
//   //console.log(props.scale);
//   // console.log("--", primitiveRef.current.scale);
// });
