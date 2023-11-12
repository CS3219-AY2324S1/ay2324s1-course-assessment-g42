import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";


function VideoCall({roomId, username}) {
  const [peerId, setPeerId] = useState(null);
  const socketRef = useRef();
  const [myPeer, setMyPeer] = useState(null);


  useEffect(() => {
    const id = `${username}_${roomId}`;
    var peer = myPeer;
    if (!myPeer) {
      peer = new Peer();
      setMyPeer(peer);
    }

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5005',  { transports : ['websocket'] });
    }

    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      socketRef.current.emit('inform-id', roomId, id);
      });
    
    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({ video: true, audio: true }, (stream) => {
        this.myVideo.srcObject = stream;
        this.myVideo.play();
        
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          this.friendVideo.srcObject = remoteStream;
          this.friendVideo.play();
        });
      }, err => { console.log('Error!') });
      console.log('got call');
      });

    const videoCall = (partnerId) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({ video: true, audio: true }, (stream) => {
        this.myVideo.srcObject = stream;
        this.myVideo.play();
        const call = myPeer.call(partnerId, stream);
        call.on('stream', (remoteStream) => {
          this.friendVideo.srcObject = remoteStream;
          this.friendVideo.play();
        });
      }, err => { console.log('Error!') });
      console.log('initiated call');
      };

    socketRef.current.on('initiate-call', (partnerId) => {
      videoCall(partnerId);
    })




  })
  


  return (
    <>
      <h1>hey yo</h1>
      <video ref={ref => this.myVideo = ref} />
      <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    </>
  );
}

export default VideoCall;