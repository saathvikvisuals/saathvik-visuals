"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Plays the project's single recorded walkthrough clip, but seeks to a different
 * starting moment per `seekRatio` so two video-marked stages in the same project
 * don't show the identical opening frame. Falls back silently (parent should also
 * render ProcessArt behind this, or check `failed`) if the file is missing.
 * Skips autoplay/loop for prefers-reduced-motion (shows the seeked frame, paused).
 */
export function StageVideo({
  slug,
  seekRatio = 0,
  videoFile,
  className,
}: {
  slug: string;
  seekRatio?: number;
  /** Optional distinct clip basename (no extension) for this stage, e.g. "just-enough-home" — falls back to the project's single recorded clip + seekRatio when omitted. */
  videoFile?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  if (failed) return null;

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className ?? ""}`}
      src={`/project-videos/${videoFile ?? slug}.webm`}
      autoPlay={!reduceMotion}
      muted
      loop={!reduceMotion}
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      onLoadedMetadata={(event) => {
        const video = event.currentTarget;
        if (!videoFile && seekRatio > 0 && Number.isFinite(video.duration)) {
          video.currentTime = video.duration * seekRatio;
        }
      }}
    />
  );
}
