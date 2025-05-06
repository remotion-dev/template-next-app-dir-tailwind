"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { z } from "zod";
import {
  CompositionProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { RenderControls } from "../components/RenderControls";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";
import { Main } from "../remotion/MyComp/Main";
import FileDrop from "../components/FileUploader"; // Adjust path based on where your uploader is located

const Home: NextPage = () => {
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);
  const [text, setText] = useState<string>("");

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      src: uploadedURL!,
    };
  }, [uploadedURL]);

  if(uploadedURL){
    console.log("uploadedURL", uploadedURL)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {!uploadedURL ? (
        <FileDrop onUploadComplete={(url) => setUploadedURL(url)} />
      ) : (
        <div className="max-w-screen-md m-auto mb-5">
          <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
            <Player
              component={Main}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{ width: "100%" }}
              controls
            />
          </div>
          <RenderControls
            text={text}
            setText={setText}
            inputProps={inputProps}
          />
          <Spacing />
          <Spacing />
          <Spacing />
          <Spacing />
          <Tips />
        </div>
      )}
    </div>
  );
};

export default Home;
