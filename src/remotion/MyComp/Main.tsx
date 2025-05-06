"use client"
import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  CalculateMetadataFunction,
  continueRender,
  delayRender,
  useVideoConfig,
} from "remotion";
import {preloadVideo} from '@remotion/preload';
import { z } from "zod";
import SubtitlePage from "./SubtitlePage";
import { getVideoMetadata } from "@remotion/media-utils";
import { loadFont } from "./load-font";
import { Caption, createTikTokStyleCaptions } from "@remotion/captions";

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

  console.log("Src:", src);
 
  const [subtitles, setSubtitles] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();

  useEffect(() => {
    const prepareResources = async () => {
      try {
        preloadVideo(src);

        // afaik what we can do is, fetch the captions after we uploaded, and get the url for the json aswell. We'll make sure its same, and then
        // based on what they did in the template, we can show both the video and the json



        // Fetch subtitles
        // const res = await fetch(`/api/get-captions?url=${src}`);
        // const res = fetch("/sample-video.json")
        // const data = (await res.json());
        // if (data?.json) {
        //   await loadFont(); // Load font before rendering
        //   const parsedSubs = data.json;
        //   setSubtitles(parsedSubs);
        // }
        
        fetch(`https://pub-449b3b5dd7dc457e86e54d9c58eaa858.r2.dev/uploads/${src.replace(".mp4",".json")}`)
  .then(response => response.json())
  .then(dats => {
    // const data = [
    //   { "text": " hey", "startMs": 330, "endMs": 400, "timestampMs": 420, "confidence": 1.0 },
    //   { "text": " guys.", "startMs": 500, "endMs": 700, "timestampMs": 500, "confidence": 1.0 },
    //   { "text": " na", "startMs": 1040, "endMs": 1170, "timestampMs": 1040, "confidence": 0.963153600692749 },
    //   { "text": " inga", "startMs": 1230, "endMs": 1500, "timestampMs": 1230, "confidence": 0.9821343421936035 },
    //   { "text": " Flutter", "startMs": 1590, "endMs": 2040, "timestampMs": 1590, "confidence": 0.977540910243988 },
    //   { "text": " eventku", "startMs": 2040, "endMs": 2470, "timestampMs": 2040, "confidence": 0.9611732959747314 },
    //   { "text": " third", "startMs": 2510, "endMs": 2740, "timestampMs": 2510, "confidence": 0.9724959135055542 },
    //   { "text": " time", "startMs": 2740, "endMs": 2890, "timestampMs": 2740, "confidence": 0.9895510077476501 },
    //   { "text": " varen.", "startMs": 2890, "endMs": 3260, "timestampMs": 2890, "confidence": 0.9883281588554382 },
    //   { "text": " so", "startMs": 3380, "endMs": 3480, "timestampMs": 3380, "confidence": 0.970455527305603 },
    //   { "text": " eppayum", "startMs": 3480, "endMs": 3980, "timestampMs": 3480, "confidence": 0.9785779714584351 },
    //   { "text": " pola", "startMs": 3980, "endMs": 4250, "timestampMs": 3980, "confidence": 0.9884575605392456 },
    //   { "text": " superra", "startMs": 4250, "endMs": 4660, "timestampMs": 4250, "confidence": 0.9728028774261475 },
    //   { "text": " panni", "startMs": 4660, "endMs": 4940, "timestampMs": 4660, "confidence": 0.9801964163780212 },
    //   { "text": " irukkanga.", "startMs": 4940, "endMs": 5430, "timestampMs": 4940, "confidence": 0.9782485961914062 },
    //   { "text": " first", "startMs": 5880, "endMs": 6230, "timestampMs": 5880, "confidence": 0.9451284408569336 },
    //   { "text": " year", "startMs": 6230, "endMs": 6450, "timestampMs": 6230, "confidence": 0.9851028919219971 },
    //   { "text": " anniversary", "startMs": 6450, "endMs": 7270, "timestampMs": 6450, "confidence": 0.9850393533706665 },
    //   { "text": " celebrate", "startMs": 7270, "endMs": 7760, "timestampMs": 7270, "confidence": 0.9838640689849854 },
    //   { "text": " pandrom.", "startMs": 7760, "endMs": 8150, "timestampMs": 7760, "confidence": 0.9847455024719238 },
    //   { "text": " athuvillama", "startMs": 8640, "endMs": 9370, "timestampMs": 8640, "confidence": 0.948766827583313 },
    //   { "text": " ennoda", "startMs": 9370, "endMs": 9730, "timestampMs": 9370, "confidence": 0.980806827545166 },
    //   { "text": " birthday", "startMs": 9730, "endMs": 10280, "timestampMs": 9530, "confidence": 0.9672094583511353 },
    //   { "text": " iyum", "startMs": 10280, "endMs": 10560, "timestampMs": 10420, "confidence": 0.9787601232528687 },
    //   { "text": " inga", "startMs": 10560, "endMs": 10820, "timestampMs": 10560, "confidence": 0.9822489023208618 },
    //   { "text": " celebrate", "startMs": 10820, "endMs": 11320, "timestampMs": 10820, "confidence": 0.9666326642036438 },
    //   { "text": " pannanga.", "startMs": 11320, "endMs": 11680, "timestampMs": 11320, "confidence": 0.9743891954421997 },
    //   { "text": " so", "startMs": 11790, "endMs": 11890, "timestampMs": 11790, "confidence": 0.9849026203155518 },
    //   { "text": " i", "startMs": 11900, "endMs": 12030, "timestampMs": 11900, "confidence": 0.7891109585762024 },
    //   { "text": " am", "startMs": 12030, "endMs": 12170, "timestampMs": 12030, "confidence": 0.9856014251708984 },
    //   { "text": " so", "startMs": 12170, "endMs": 12290, "timestampMs": 12170, "confidence": 0.9455483555793762 },
    //   { "text": " happy.", "startMs": 12290, "endMs": 12610, "timestampMs": 12290, "confidence": 0.9835572242736816 },
    //   { "text": " and", "startMs": 13020, "endMs": 13180, "timestampMs": 13020, "confidence": 0.9762616157531738 },
    //   { "text": " superra", "startMs": 13180, "endMs": 13580, "timestampMs": 13180, "confidence": 0.9735192656517029 },
    //   { "text": " irundhuchi.", "startMs": 13580, "endMs": 14110, "timestampMs": 13580, "confidence": 0.9681878089904785 },
    //   { "text": " speaker", "startMs": 14220, "endMs": 14610, "timestampMs": 14220, "confidence": 0.9689121246337891 },
    //   { "text": " ellame", "startMs": 14610, "endMs": 14850, "timestampMs": 14610, "confidence": 0.9714824557304382 },
    //   { "text": " nalla", "startMs": 14850, "endMs": 15050, "timestampMs": 14850, "confidence": 0.9662530422210693 },
    //   { "text": " pannirundhanga.", "startMs": 15050, "endMs": 15700, "timestampMs": 15050, "confidence": 0.9771720767021179 },
    //   { "text": " pakkaava", "startMs": 16020, "endMs": 16420, "timestampMs": 16020, "confidence": 0.9851248860359192 },
    //   { "text": " pannirukkanga.", "startMs": 16420, "endMs": 17080, "timestampMs": 16420, "confidence": 0.9730349779129028 },
    //   { "text": " happy", "startMs": 17480, "endMs": 17690, "timestampMs": 17480, "confidence": 0.9679946899414062 },
    //   { "text": " birthday", "startMs": 17690, "endMs": 18050, "timestampMs": 17690, "confidence": 0.9784902334213257 },
    //   { "text": " akka.", "startMs": 18050, "endMs": 18340, "timestampMs": 18050, "confidence": 0.9605506658554077 },
    //   { "text": " thank", "startMs": 18540, "endMs": 18700, "timestampMs": 18540, "confidence": 0.9668000936508179 },
    //   { "text": " you", "startMs": 18700, "endMs": 18880, "timestampMs": 18700, "confidence": 0.8783838152885437 },
    //   { "text": " so", "startMs": 18880, "endMs": 19030, "timestampMs": 18880, "confidence": 0.8466901183128357 },
    //   { "text": " much.", "startMs": 19030, "endMs": 19400, "timestampMs": 19030, "confidence": 0.9694797992706299 }
    // ];
    console.log(dats)
    setSubtitles(dats);
    continueRender(handle)

    console.log(dats);
  })
  .catch(error => console.error('Error loading JSON:', error));

        if (subtitles) {
          console.log("Subs are there")
          await loadFont(); // Load font before rendering
          const parsedSubs = subtitles;
          setSubtitles(parsedSubs);
        }

        // Preload video while subtitles are being processed
        
        continueRender(handle);
      } catch (e) {
        console.error("Error during preparation", e);
      }
    };

    prepareResources();
  }, [src, handle]);

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles ?? [],
    });
  }, [subtitles]);


  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <AbsoluteFill>
        <Video
          pauseWhenBuffering={true}
          acceptableTimeShiftInSeconds={0.01}
          style={{ objectFit: "cover" }}
          src={`https://pub-449b3b5dd7dc457e86e54d9c58eaa858.r2.dev/uploads/${src}`}
        />
      </AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS
        );
        const durationInFrames = subtitleEndFrame - subtitleStartFrame;
        if (durationInFrames <= 0) return null;

        return (
          <Sequence
            key={index}
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
