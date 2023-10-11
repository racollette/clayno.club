import React, { useState, useRef, useEffect } from "react";
import { RangeSlider } from "~/@/components/ui/slider";
import { Separator } from "~/@/components/ui/separator";
import { HiPlay, HiPause, HiCheck } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";
import { api } from "~/utils/api";
import { AudioFile } from "@prisma/client";
import { useToast } from "~/@/components/ui/use-toast";

interface AudioPlayerProps {
  song: AudioFile;
}

const DEFAULT_DURATION: number = 10;

const AudioPlayer: React.FC<AudioPlayerProps> = ({ song }) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [selectedStartTime, setSelectedStartTime] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<number>(10);
  const [mode, setMode] = useState<string>("full");

  const setClipStart = api.fusion.setClipStart.useMutation();

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSegmentChange = (v: number[]) => {
    setClipDuration(DEFAULT_DURATION);
    setMode("segment");
    if (!isNaN(v[0] ?? 0)) {
      const newStartTime = v[0] ?? 0;
      audioRef.current!.currentTime = newStartTime;
      setSelectedStartTime(newStartTime);
      audioRef.current!.play();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handlePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMode("full");
    setSelectedStartTime(audioRef.current!.currentTime);
    setClipDuration(audioRef.current!.duration);
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(!audioRef.current.paused);
    }

    e.stopPropagation();
  };

  const handleSetClip = (clipStart: number) => {
    console.log(clipStart);
    try {
      setClipStart.mutate({
        id: song.id,
        clipStart: clipStart,
      });
      toast({
        title: "Clip set successfully",
      });
      setMode("full");
    } catch {
      toast({
        title: "An error occurred.",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        if (mode === "full") {
          setSelectedStartTime(currentTime);
        }
        if (currentTime >= selectedStartTime + clipDuration) {
          audioRef.current.pause();
        }
      }
    };

    audioRef.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      // Clean up the event listener when the component unmounts
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [selectedStartTime, clipDuration]);

  useEffect(() => {
    setTimeout(() => {
      handleTimeUpdate();
    }, 500);
    if (audioRef.current) {
      audioRef.current.volume = 0.25; // Set default volume to 50%
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Separator />
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="max-w- truncate  whitespace-nowrap text-xs">
          {song.name}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className={`cursor-pointer ${
                mode === "segment"
                  ? `bg-green-500 hover:bg-green-400`
                  : ` bg-neutral-700 hover:bg-neutral-600`
              } rounded-md`}
              disabled={mode === "full"}
              onClick={() => {
                handleSetClip(selectedStartTime);
              }}
            >
              <HiCheck
                size={28}
                className={`${
                  mode === "segment"
                    ? `text-white`
                    : `cursor-not-allowed text-neutral-500`
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Set Clip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {song.url && (
        <div className="audio-player text-center">
          <audio ref={audioRef} src={song.url} controls className="hidden" />
          <div className="segment-controls mt-4 flex items-center justify-center gap-2">
            <button onClick={handlePlayPause}>
              {isPlaying ? <HiPause size={32} /> : <HiPlay size={32} />}
            </button>
            {/* <div className="w-16 text-sm">{formatTime(0.0)}</div> */}
            <RangeSlider
              min={0}
              max={duration - DEFAULT_DURATION}
              step={0.01}
              value={[selectedStartTime]}
              defaultValue={[0]}
              onValueChange={(v) => handleSegmentChange(v)}
              rangeLow={formatTime(selectedStartTime)}
              rangeHigh={formatTime(selectedStartTime + DEFAULT_DURATION)}
            />
            <div className="w-16 text-sm">{formatTime(duration)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
