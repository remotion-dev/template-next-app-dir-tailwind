import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  src: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  src: "https://storage.googleapis.com/tanglish/sample-video1.mp4",
};

export const DURATION_IN_FRAMES = 550;
export const VIDEO_WIDTH = 720;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;
