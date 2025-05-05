import {
  AbsoluteFill,
  Video,

} from "remotion";

import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});
export const Main = () => {
 
  return (
    <AbsoluteFill className="bg-white">
      <Video
          pauseWhenBuffering={true}
          acceptableTimeShiftInSeconds={0.01}
          style={{ objectFit: "cover" }}
          src={"https://storage.googleapis.com/tanglish/sample-video1.mp4"}
        />
    </AbsoluteFill>
  );
};
