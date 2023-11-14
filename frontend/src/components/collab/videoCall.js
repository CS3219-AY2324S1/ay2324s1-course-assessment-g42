import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import "../../styles/videoCall.css";


function VideoCall({roomId}) {
  const socketRef = useRef();
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState();

  useEffect(() => {
    var mypeer = new Peer();
    console.log(mypeer);
    setPeer(mypeer);
    
    socketRef.current = io('http://localhost:5005',  { transports : ['websocket'] });

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({ video: true, audio: true }, (stream) => {
      setStream(stream);
      const video = document.querySelector("video");
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
      };
    }, err => { console.log('Error!') });
    

    return () => {
      if (stream) {
        console.log(' closed');
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
          
    };
  }, []);

  useEffect(() => {
    if (peer) {
      peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        socketRef.current.emit('inform-id', roomId, peer.id);
        });
      
      peer.on('call', (call) => {
        // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (stream) {
          call.answer(stream);
        }
        
        // getUserMedia({ video: true, audio: true }, (stream) => {
        //   const video = document.querySelector("video");
        //   video.srcObject = stream;
        //   video.onloadedmetadata = (e) => {
        //     video.play();
        //   };
          
        // }, err => { console.log('Error!') });

        call.on('stream', (remoteStream) => {
          const video = document.querySelector("video");
          video.srcObject = remoteStream;
          video.onloadedmetadata = (e) => {
            video.play();
          };
        });
      

        call.on('close', () => {
          console.log('call closed');
          const tracks = stream.getTracks();
          tracks.stop();
        });
      });

      const videoCall = (partnerId) => {
        console.log('initiated call');
        peer.call(partnerId, stream);
      };

      socketRef.current.on('initiate-call', (partnerId) => {
        videoCall(partnerId);
      });

    }}, [roomId, peer]);
  

  return (
    <div >
      <video className="video"/>
      <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    </div>
  );
}

export default VideoCall;