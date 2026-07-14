import LocalVideo from "./LocalVideo";
import { useRef, useEffect, useState } from "react";

interface VideoCallLayoutProps {
  meetingId: string;
}

const VideoCallLayout = ({
  meetingId,
}: VideoCallLayoutProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Nexus Video Meeting
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Meeting ID: {meetingId}
          </p>
        </div>

        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="flex items-center gap-2 text-sm font-medium text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Connected
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="p-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {/* Local */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-2xl">
            <LocalVideo stream={stream} />

            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 backdrop-blur">
              <p className="text-sm font-medium text-white">
                You
              </p>
            </div>
          </div>

          {/* Remote */}
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                <svg
                  className="h-10 w-10 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm-9 13.5a5.25 5.25 0 0110.5 0"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-white">
                Waiting for participant...
              </h2>

              <p className="mt-2 text-slate-400">
                Share this meeting with the other participant.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoCallLayout;