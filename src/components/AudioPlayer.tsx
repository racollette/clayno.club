import React, { useState, useRef, useEffect } from "react";
import { RangeSlider, Slider } from "~/@/components/ui/slider";
import { HiPlay, HiPause, HiCheck } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";

interface AudioPlayerProps {
  name: string;
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, name }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [selectedStartTime, setSelectedStartTime] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<number>(10);
  const [mode, setMode] = useState<string>("full");
  const defaultDuration = 10;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSegmentChange = (v: number[]) => {
    setClipDuration(defaultDuration);
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
    <>
      <div className="flex flex-row items-center gap-4">
        <div className="text-ellipsis whitespace-nowrap text-sm">{name}</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className={`cursor-pointer ${
                mode === "segment" ? `bg-green-400` : `bg-neutral-700`
              } rounded-md hover:bg-white`}
              disabled={mode === "full"}
              onClick={() => {
                setMode("full");
              }}
            >
              <HiCheck
                size={28}
                className={`${
                  mode === "segment" ? `text-white` : `text-neutral-500`
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Set Clip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="audio-player text-center">
        <audio ref={audioRef} src={audioUrl} controls className="hidden" />
        <div className="segment-controls mt-4 flex items-center justify-center">
          <button onClick={handlePlayPause}>
            {isPlaying ? <HiPause size={28} /> : <HiPlay size={28} />}
          </button>
          <div className="w-16">{formatTime(0.0)}</div>
          <RangeSlider
            min={0}
            max={duration - defaultDuration}
            step={0.01}
            value={[selectedStartTime]}
            defaultValue={[0]}
            onValueChange={(v) => handleSegmentChange(v)}
            rangeLow={formatTime(selectedStartTime)}
            rangeHigh={formatTime(selectedStartTime + defaultDuration)}
          />
          <div className="w-16">{formatTime(duration)}</div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
