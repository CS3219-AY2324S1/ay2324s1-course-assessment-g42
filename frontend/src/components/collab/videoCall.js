import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

// replace your server endpoint here
const socket = io("http://localhost:5004");

function VideoCall({roomId}) {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if(myVideo) {
        myVideo.current.srcObject = stream;
      }
    });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [myVideo]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <div>
        <div className="flex flex-row h-full w-full justify-center gap-[15%] h-screen z-">
          <div>
            <div class="flex-grow flex flex-col items-center justify-center h-[90%]">
              <div class="flex flex-row gap-32">
                <div class="flex flex-col items-center justify-center w-full">
                  <div className="video">
                    {stream && (
                      <video
                        className="rounded-full"
                        playsInline
                        muted
                        ref={myVideo}
                        autoPlay
                        style={{ width: "300px" }}
                      />
                    )}
                  </div>
                  <span className="text-white font-bold text-lg mb-4">{caller}</span>
                  <p className="text-white">{me}</p>
                </div>

                <div class="flex flex-col items-center justify-center w-full">
                  {callAccepted && !callEnded ? (
                    <video
                      className="rounded-full"
                      playsInline
                      ref={userVideo}
                      autoPlay
                      style={{ width: "300px" }}
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <span class="text-white font-bold text-lg">{idToCall}</span>
                    </div>
                  )}
                </div>
              </div>
              <textarea
                className="text-black"
                defaultValue={idToCall}
                onChange={(e) => {
                  setIdToCall(e.target.value);
                }}
              />
              <div>
                {callAccepted && !callEnded ? (
                  <button className="text-black hover:text-gray-400 mr-6 font-bold bg-white rounded-md m-4 px-2" onClick={leaveCall}>
                    End Call
                  </button>
                ) : (
                  <button
                    className="text-black hover:text-gray-400 mr-6 font-bold bg-white rounded-md m-4 px-2"
                    onClick={() => callUser(idToCall)}
                  >
                    Call
                  </button>
                )}
              </div>
              <div className="text-white">
                {receivingCall && !callAccepted ? (
                  <div className="caller flex flex-col">
                    <h1 className="text-white">{caller} is calling...</h1>
                    <button
                      className="text-black text-xl hover:text-gray-400 mr-6 font-bold bg-white rounded-md m-4 px-2"
                      onClick={answerCall}
                    >
                      Answer
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCall;