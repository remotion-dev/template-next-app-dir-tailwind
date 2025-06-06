"use client"
import { useEffect, useMemo, useState, useRef } from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  CalculateMetadataFunction,
  continueRender,
  delayRender,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import SubtitlePage from "./SubtitlePage";
import { getVideoMetadata } from "@remotion/media-utils";
import { loadFont } from "./load-font";
import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import {prefetch} from 'remotion';
// import type {PrefetchOnProgress} from 'remotion';

export type SubtitleProp = {
  startInSeconds: number;
  text: string;
};

export const captionedVideoSchema = z.object({
  src: z.string(),
});

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof captionedVideoSchema>
> = async ({ props }) => {
  const fps = 30;
  const metadata = await getVideoMetadata(props.src);

  return {
    fps,
    durationInFrames: Math.floor(metadata.durationInSeconds * fps),
  };
};

const SWITCH_CAPTIONS_EVERY_MS = 200;

export const Main:React.FC<{
  src: string;
}> = ({ src }) => {
  const [subtitles, setSubtitles] = useState<Caption[] | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prepareResources = async () => {
      try {
        // Load font first
        await loadFont();

        // Prefetch video with higher priority
        const {waitUntilDone} = prefetch(`https://pub-449b3b5dd7dc457e86e54d9c58eaa858.r2.dev/uploads/${src}`, {
          method: 'blob-url',
          onProgress: (progress) => {
            if (progress.totalBytes) {
              console.log('Loading progress:', Math.round(progress.loadedBytes / progress.totalBytes * 100) + '%');
            }
          },
        });

        // Load subtitles in parallel
        const [subtitleResponse] = await Promise.all([
          fetch(`https://pub-449b3b5dd7dc457e86e54d9c58eaa858.r2.dev/uploads/${src.replace(".mp4",".json")}`),
          waitUntilDone() // Wait for video to be fully loaded
        ]);
        
        const data = await subtitleResponse.json();
        
        // Set subtitles and mark as ready
        setSubtitles(data);
        setIsReady(true);
        continueRender(handle);
      } catch (e) {
        console.error("Error during preparation", e);
      }
    };

    prepareResources();
  }, [src, handle]);

  const { pages } = useMemo(() => {
    if (!subtitles) return { pages: [] };
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles,
    });
  }, [subtitles]);

  if (!isReady) {
    return null;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill>
        <Video
          ref={videoRef}
          pauseWhenBuffering={true}
          acceptableTimeShiftInSeconds={0.5}
          style={{ 
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          src={`https://pub-449b3b5dd7dc457e86e54d9c58eaa858.r2.dev/uploads/${src}`}
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = 1;
            }
          }}
        />
      </AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = Math.floor(((page.startMs) / 1000) * fps);
const subtitleEndFrame = Math.max(
  nextPage ? Math.floor((nextPage.startMs / 1000) * fps) : Infinity,
  Math.max(
    subtitleStartFrame + Math.floor((SWITCH_CAPTIONS_EVERY_MS / 1000) * fps)
  )
);

        const durationInFrames = subtitleEndFrame - subtitleStartFrame;
        
        if (durationInFrames <= 0) return null;

        return (
          <Sequence
            key={`${index}-${subtitleStartFrame}`}
            from={subtitleStartFrame}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
