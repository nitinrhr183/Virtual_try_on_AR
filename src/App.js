import React, { Suspense } from "react";
import Persppointobt from "./Persppointobt";
import Pointrender from "./Pointrender";
import PointImage from "./PointImage";

const App = () => {
  return (
    <div>
      <Suspense fallback={null}>
        {/* <Pointrender /> */}
        <Persppointobt />
        {/* <PointImage /> */}
      </Suspense>
    </div>
  );
};

export default App;
