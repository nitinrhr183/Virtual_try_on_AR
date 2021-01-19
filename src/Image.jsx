import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader, useFrame } from "react-three-fiber";
import * as THREE from "three";

function Image(props) {
  const texture = useLoader(THREE.TextureLoader, "necklace.png");
  return (
    <mesh {...props}>
      <planeGeometry attach="geometry" args={[10, 7.5]} />
      <meshLambertMaterial attach="material" map={texture} />
    </mesh>
  );
}

export default Image;
