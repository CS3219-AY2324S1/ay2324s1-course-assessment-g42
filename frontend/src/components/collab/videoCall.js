import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";


function VideoCall({roomId, username}) {
  const socketRef = useRef();
  const [peer, setPeer] = useState(null);
  const myVideo = useRef();
  const [initialized, setInitialized] = useState(false);


  useEffect(() => {
    if (peer == null) {
      var mypeer = new Peer();
      console.log(mypeer);
      setPeer(mypeer);
    }
    }
  , [])

  useEffect(() => {
    if (peer) {

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5005',  { transports : ['websocket'] });
    }
    
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      socketRef.current.emit('inform-id', roomId, peer.id);
      });
    
    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({ video: true, audio: true }, (stream) => {
        const video = document.querySelector("video");
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
          video.play();
        };
        call.answer(stream);
      }, err => { console.log('Error!') });
      console.log('got call');
      });

    const videoCall = (partnerId) => {
      console.log('initiated call');
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({ video: true, audio: true }, (stream) => {

        const video = document.querySelector("video");
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
          video.play();
        };
        
        const mediaConnection = peer.call(partnerId, stream);
        
      }, err => { console.log('Error!') });
      };

    socketRef.current.on('initiate-call', (partnerId) => {
      videoCall(partnerId);
    })
  }



  }, [initialized, peer])

  


  return (
    <>
      <video />
      <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    </>
  );
}

export default VideoCall;