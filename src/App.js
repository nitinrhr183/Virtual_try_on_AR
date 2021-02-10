import React, { Suspense } from "react";
import Persppointobt from "./Persppointobt";
import Pointrender from "./Pointrender";
import PointImage from "./PointImage";
import Images from "./Config";

const App = () => {
  //earrings,necklaces...
  //GITDEMO....................
  const isTwoD = false;
  //config---
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {isTwoD ? (
          <Persppointobt
            leftEarring={"earring.glb"}
            rightEarring={"earring2.glb"}
            necklace={"sceneneck.glb"}
            scaleEar={[20, 20, 20]}
            scaleNeck={[2500, 2500, 2500]}
          />
        ) : (
          <PointImage
            earring={Images[0].earRings[0].image}
            necklace={Images[1].necklace[0].image}
            scaleEar={Images[0].earRings[0].scaling}
            scaleNeck={Images[1].necklace[0].scaling}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;
