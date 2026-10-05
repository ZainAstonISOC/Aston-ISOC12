"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadAudio, releaseAudio } from "./audio";

export interface Track {
  /** Verse key, e.g. "2:255" — reported back as `current` while it plays. */
  key: string;
  url: string;
}

type Status = "idle" | "loading" | "playing" | "error";

// A few samples of silence. iOS only lets an <audio> element start
// programmatically once a tap has started it, and the real file is not ready
// until after an await — so the tap plays this first.
const SILENT =
  "data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA==";

/**
 * Plays a queue of ayat back to back, one element, the next file fetched while
 * the current one plays. `progress` runs 0→1 across the whole queue.
 */
export function useRecitation() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const runRef = useRef(0);
  const wakeRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<{ status: Status; current: string | null; progress: number }>({
    status: "idle",
    current: null,
    progress: 0,
  });

  const stop = useCallback(() => {
    runRef.current++;
    audioRef.current?.pause();
    wakeRef.current?.();
    wakeRef.current = null;
    setState({ status: "idle", current: null, progress: 0 });
  }, []);

  const play = useCallback(async (tracks: Track[]) => {
    if (!tracks.length) return;
    const run = ++runRef.current;
    wakeRef.current?.();
    const audio = (audioRef.current ??= new Audio());
    audio.src = SILENT;
    audio.play().catch(() => {});
    setState({ status: "loading", current: tracks[0].key, progress: 0 });

    let next: Promise<string> | null = loadAudio(tracks[0].url);
    for (let i = 0; i < tracks.length; i++) {
      const src = await next!;
      next = i + 1 < tracks.length ? loadAudio(tracks[i + 1].url) : null;
      if (run !== runRef.current) {
        releaseAudio(src);
        next?.then(releaseAudio);
        return;
      }
      audio.src = src;
      audio.ontimeupdate = () => {
        if (run !== runRef.current || !audio.duration) return;
        const progress = (i + audio.currentTime / audio.duration) / tracks.length;
        setState((s) => ({ ...s, progress }));
      };
      setState({ status: "playing", current: tracks[i].key, progress: i / tracks.length });
      const finished = await new Promise<boolean>((resolve) => {
        wakeRef.current = () => resolve(false);
        audio.onended = () => resolve(true);
        audio.onerror = () => resolve(false);
        audio.play().catch(() => resolve(false));
      });
      wakeRef.current = null;
      audio.ontimeupdate = audio.onended = audio.onerror = null;
      releaseAudio(src);
      if (run !== runRef.current) {
        next?.then(releaseAudio);
        return;
      }
      if (!finished) {
        next?.then(releaseAudio);
        setState({ status: "error", current: null, progress: 0 });
        return;
      }
    }
    setState({ status: "idle", current: null, progress: 0 });
  }, []);

  useEffect(
    () => () => {
      runRef.current++;
      audioRef.current?.pause();
    },
    [],
  );

  return { ...state, play, stop };
}
