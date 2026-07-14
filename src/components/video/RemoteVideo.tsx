import React, { useEffect, useRef } from "react";
import { User } from "lucide-react";

interface Props {
  stream: MediaStream | null;
}

const RemoteVideo: React.FC<Props> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-950">
      {stream ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full min-h-[420px] w-full object-cover"
          />

          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md">
            <span className="text-sm font-medium text-white">
              Participant
            </span>
          </div>
        </>
      ) : (
        <div className="flex h-[420px] w-full flex-col items-center justify-center bg-slate-900">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
            <User className="h-12 w-12 text-slate-500" />
          </div>

          <h2 className="text-xl font-semibold text-white">
            Waiting for participant...
          </h2>

          <p className="mt-2 text-center text-sm text-slate-400">
            The other participant hasn't joined the meeting yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default RemoteVideo;