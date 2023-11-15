import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import "../../styles/videoCall.css";


function VideoCall({roomId}) {
  const socketRef = useRef();
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState();

  const getStream = async () => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    const stream = await getUserMedia({ video: true, audio: true }, (stream) => {
      console.log('got stream');
      setStream(stream);
      return stream;
    }, (err) => {console.log(err);});; 
    
  };

  useEffect(() => {
    var mypeer = new Peer();
    console.log(peer);
    setPeer(mypeer);
    
    socketRef.current = io('http://localhost:5005',  { transports : ['websocket'] });

    getStream();
  }, [])


  useEffect(() => {
    if (peer) {
      peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        socketRef.current.emit('inform-id', roomId, peer.id);
        });
      
      peer.on('call', (call) => {
        call.answer(stream);
        

        call.on('stream', (remoteStream) => {
          const video = document.querySelector("video");
          video.srcObject = remoteStream;
          video.onloadedmetadata = (e) => {
            video.play();
          };
        });
      

        call.on('close', () => {
          console.log('call closed');
          const video = document.querySelector("video");
          video.remove();
          const tracks = stream.getTracks();
          tracks.forEach((track) => {
            track.stop();
          });
        });
      });

      const videoCall = (partnerId) => {
        console.log(`initiated call with ${partnerId}`);
        const call = peer.call(partnerId, stream);
        if (call) {
          call.on('stream', (remoteStream) => {
            const video = document.querySelector("video");
            video.srcObject = remoteStream;
            video.onloadedmetadata = (e) => {
              video.play();
            };
          });
        }
        
      };

      socketRef.current.on('initiate-call', (partnerId) => {
        videoCall(partnerId);
      });

      return () => {
        if (stream) {
          console.log('closed stream');
          peer.destroy();
          const video = document.querySelector("video");
          if (video) {
            video.remove();
          }
          
          const tracks = stream.getTracks();
          tracks.forEach((track) => {
            track.stop();
          });
        }
            
      };

    }}, [peer, stream, roomId]);
  

  return (
    <div >
      <video className="video"/>
      <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    </div>
  );
}

export default VideoCall;