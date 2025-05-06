"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next"
import React, { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { loadFont } from "../remotion/MyComp/load-font";
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
  const [flag, setFlag]=useState(false)
  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      src: uploadedURL!,
    };
  }, [uploadedURL]);

  useEffect(() => {
    if (!uploadedURL) return;
  
    const fetchCaptions = async () => {
      try {
        console.log("uploadedURL", uploadedURL);
        const res = await fetch(`/api/get-captions?url=${uploadedURL}`);
        const data = await res.json();
        
        if (data?.json) {
          await loadFont(); // Load font before rendering
          const parsedSubs = data.json;
          console.log("JSON is obtained", parsedSubs)
          setFlag(!flag)
        }
        console.log("Uhm data", data)
      } catch (error) {
        console.error("Error fetching captions:", error);
      }
    };
  
    fetchCaptions();
  }, [uploadedURL]);
  

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {(uploadedURL && flag) ? (
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
      ) : (
        <FileDrop onUploadComplete={(url) => setUploadedURL(url)} />
      )}
    </div>
  );
};

export default Home;
