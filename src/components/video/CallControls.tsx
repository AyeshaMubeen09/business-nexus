import React from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
} from "lucide-react";

interface Props {
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

const CallControls: React.FC<Props> = ({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onLeave,
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-6 rounded-full border border-slate-700/70 bg-slate-900/90 px-6 py-4 shadow-2xl backdrop-blur-xl">
        {/* ==========================================
            MICROPHONE
        ========================================== */}

        <button
          onClick={onToggleAudio}
          aria-label={
            audioEnabled
              ? "Mute microphone"
              : "Unmute microphone"
          }
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 active:scale-95 ${
            audioEnabled
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {audioEnabled ? (
            <Mic size={24} />
          ) : (
            <MicOff size={24} />
          )}
        </button>

        {/* ==========================================
            CAMERA
        ========================================== */}

        <button
          onClick={onToggleVideo}
          aria-label={
            videoEnabled
              ? "Turn camera off"
              : "Turn camera on"
          }
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 active:scale-95 ${
            videoEnabled
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {videoEnabled ? (
            <Video size={24} />
          ) : (
            <VideoOff size={24} />
          )}
        </button>

        {/* ==========================================
            END CALL
        ========================================== */}

        <button
          onClick={onLeave}
          aria-label="End Call"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 active:scale-95"
        >
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
};

export default CallControls;