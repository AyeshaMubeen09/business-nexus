import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  PhoneOff,
} from "lucide-react";

import LocalVideo from "../../components/video/LocalVideo";
import RemoteVideo from "../../components/video/RemoteVideo";
import CallControls from "../../components/video/CallControls";

import { socket } from "../../socket/socket";
import webrtcService from "../../services/webrtcService";

import {
  startMeeting,
  endMeeting,
} from "../../services/meetingService";

const VideoCallPage = () => {
  const { meetingId } = useParams();

  const navigate = useNavigate();

  const [localStream, setLocalStream] =
    useState<MediaStream | null>(null);

  const [remoteStream, setRemoteStream] =
    useState<MediaStream | null>(null);

  const [audioEnabled, setAudioEnabled] =
    useState(true);

  const [videoEnabled, setVideoEnabled] =
    useState(true);

  const [connectionStatus, setConnectionStatus] =
    useState<
      "Connecting" | "Waiting" | "Connected"
    >("Connecting");

  const remoteStreamRef =
    useRef(new MediaStream());

    const meetingStartedRef = useRef(false);

  /* ==========================================
     START CAMERA + MICROPHONE
  ========================================== */

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        setLocalStream(stream);

        const peer = webrtcService.createPeer();

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        peer.ontrack = async (event) => {
          event.streams[0]
            .getTracks()
            .forEach((track) => {
              const exists =
                remoteStreamRef.current
                  .getTracks()
                  .find((t) => t.id === track.id);

              if (!exists) {
                remoteStreamRef.current.addTrack(track);
              }
            });

          setRemoteStream(
            new MediaStream(
              remoteStreamRef.current.getTracks()
            )
          );

          setConnectionStatus("Connected");
          if (!meetingStartedRef.current && meetingId) {
  meetingStartedRef.current = true;

  try {
    await startMeeting(meetingId);
  } catch (err) {
    console.error(err);
  }
}
        };

        peer.onicecandidate = (event) => {
          if (!event.candidate) return;

          socket.emit("ice-candidate", {
            roomId: meetingId,
            candidate: event.candidate,
          });
        };

        socket.emit("join-room", meetingId);

        setConnectionStatus("Waiting");
      } catch (error) {
        console.error(error);

        alert(
          "Camera or microphone permission denied."
        );
      }
    };

    startMedia();

    return () => {
  streamCleanup();
};
  }, [meetingId]);

  /* ==========================================
     SOCKET EVENTS
  ========================================== */

  useEffect(() => {
    socket.on("create-offer", async () => {
      if (!webrtcService.isStable()) return;

      console.log("Creating offer...");

      const offer =
        await webrtcService.createOffer();

      if (!offer) return;

      socket.emit("offer", {
        roomId: meetingId,
        offer,
      });
    });

    socket.on("offer", async ({ offer }) => {
      if (!webrtcService.isStable()) return;

      console.log("Offer received");

      const answer =
        await webrtcService.createAnswer(offer);

      if (!answer) return;

      socket.emit("answer", {
        roomId: meetingId,
        answer,
      });
    });

    socket.on("answer", async ({ answer }) => {
      console.log("Answer received");

      await webrtcService.setRemoteAnswer(answer);
    });

    socket.on(
      "ice-candidate",
      async ({ candidate }) => {
        console.log("ICE Candidate received");

        await webrtcService.addIceCandidate(
          candidate
        );
      }
    );

    socket.on("remote-audio-toggle", (enabled) => {
      console.log("Remote audio:", enabled);
    });

    socket.on("remote-video-toggle", (enabled) => {
      console.log("Remote video:", enabled);
    });

    socket.on("user-left", async () => {
  remoteStreamRef.current = new MediaStream();
  setRemoteStream(null);

  try {
    if (meetingStartedRef.current && meetingId) {
      await endMeeting(meetingId);
    }
  } catch (err) {
    console.error(err);
  }
});

    return () => {
      socket.off("create-offer");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("remote-audio-toggle");
      socket.off("remote-video-toggle");
      socket.off("user-left");
    };
  }, [meetingId]);

  /* ==========================================
     CLEANUP
  ========================================== */

  const streamCleanup = () => {
    localStream?.getTracks().forEach((track) =>
      track.stop()
    );

    socket.emit("leave-room", meetingId);

    webrtcService.close();
  };

  /* ==========================================
     AUDIO
  ========================================== */

  const toggleAudio = () => {
    if (!localStream) return;

    const enabled = !audioEnabled;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });

    setAudioEnabled(enabled);

    socket.emit("toggle-audio", {
      roomId: meetingId,
      enabled,
    });
  };

  /* ==========================================
     VIDEO
  ========================================== */

  const toggleVideo = () => {
    if (!localStream) return;

    const enabled = !videoEnabled;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });

    setVideoEnabled(enabled);

    socket.emit("toggle-video", {
      roomId: meetingId,
      enabled,
    });
  };

  /* ==========================================
     END CALL
  ========================================== */

const leaveCall = async () => {
  try {
    if (meetingStartedRef.current && meetingId) {
      await endMeeting(meetingId);
    }
  } catch (err) {
    console.error(err);
  }

  streamCleanup();
  navigate("/meetings");
};

return (
  <div className="flex min-h-screen flex-col bg-slate-950 text-white">
    {/* ==========================================
        HEADER
    ========================================== */}

    <header className="flex items-center justify-between border-b border-slate-800 px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold">
          Business Nexus Meeting
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Meeting ID: {meetingId}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2">
          <Users size={18} />

          <span className="text-sm">
            {remoteStream ? "2 Participants" : "1 Participant"}
          </span>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            connectionStatus === "Connected"
              ? "bg-green-600"
              : connectionStatus === "Waiting"
              ? "bg-amber-500"
              : "bg-blue-600"
          }`}
        >
          {connectionStatus}
        </div>
      </div>
    </header>

    {/* ==========================================
        VIDEOS
    ========================================== */}

    <main className="flex flex-1 items-center justify-center p-8">
      <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
          <LocalVideo stream={localStream} />

          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 text-sm backdrop-blur">
            You
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            <div
              className={`rounded-full p-2 ${
                audioEnabled
                  ? "bg-emerald-600"
                  : "bg-red-600"
              }`}
            >
              {audioEnabled ? (
                <Mic size={18} />
              ) : (
                <MicOff size={18} />
              )}
            </div>

            <div
              className={`rounded-full p-2 ${
                videoEnabled
                  ? "bg-emerald-600"
                  : "bg-red-600"
              }`}
            >
              {videoEnabled ? (
                <Video size={18} />
              ) : (
                <VideoOff size={18} />
              )}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
          {remoteStream ? (
            <>
              <RemoteVideo stream={remoteStream} />

              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 text-sm backdrop-blur">
                Participant
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[520px] flex-col items-center justify-center text-center">
              <Users
                size={72}
                className="mb-6 text-slate-500"
              />

              <h2 className="text-2xl font-semibold">
                Waiting for participant
              </h2>

              <p className="mt-3 max-w-sm text-slate-400">
                As soon as another participant joins this
                meeting, their camera will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>

    {/* ==========================================
        CONTROLS
    ========================================== */}

    <footer className="sticky bottom-0 border-t border-slate-800 bg-slate-950/90 px-8 py-6 backdrop-blur-lg">
      <CallControls
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onLeave={leaveCall}
      />
    </footer>
  </div>
);
};

export default VideoCallPage;