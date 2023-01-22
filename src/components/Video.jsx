import React from 'react';

const constraints = {
  audio: false,
  video: {
    aspectRatio: 1,
    width: { max: 600 },
    height: { max: 600 },
    // facingMode: 'environment' // or 'environment'
  }
}

function Video(props) {
  let video = React.createRef();

  const playVideo = () => {
    video.current.play()
    props.playCallback()
  };

  if (!navigator.mediaDevices)
    console.log("Sorry, getUserMedia is not supported");
  else {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => { if (video.current && !video.current.srcObject) { video.current.srcObject = stream; } })
      navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          console.log(`Device ID: ${device.deviceId}`);
          console.log(`Device label: ${device.label}`);
          console.log(`Device kind: ${device.kind}`);
        });
      })
      .catch(error => {
        console.error(error);
      });    
  }
  return (
    <video id='video' ref={video} autoPlay playsInline onCanPlay={playVideo} />
  )
}

function areEqual(prevProps, nextProps) {
  return true; // dont re-render the video component - loses functionality when on mobile devices
}

export default React.memo(Video, areEqual);