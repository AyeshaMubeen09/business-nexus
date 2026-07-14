import React, { useEffect, useRef } from "react";
import { User } from "lucide-react";

interface Props {
  stream: MediaStream | null;
}

const LocalVideo: React.FC<Props> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-950">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full min-h-[420px] w-full object-cover"
        />
      ) : (
        <div className="flex h-[420px] w-full flex-col items-center justify-center bg-slate-900">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
            <User className="h-12 w-12 text-slate-500" />
          </div>

          <p className="text-lg font-medium text-slate-300">
            Camera Starting...
          </p>
        </div>
      )}

      {/* Name Badge */}
      <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md">
        <span className="text-sm font-medium text-white">
          You
        </span>
      </div>
    </div>
  );
};

export default LocalVideo;