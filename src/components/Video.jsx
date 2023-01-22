import React from 'react';

const constraints = {
  audio: false,
  video: {
    aspectRatio: 1,
    width: { max: 600 },
    height: { max: 600 },
    // facingMode: 'environment' // or 'environment'
    // deviceId: { exact: '' }
  }
}

function Video(props) {
  let video = React.createRef();

  const playVideo = () => {
    video.current.play()
    props.playCallback()
  };
  
  navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      if (device.kind === 'videoinput') {
        console.log(device.deviceId);
        console.log(device.label);
        console.log(device.kind);
      }
    });
  })
  
  if (!navigator.mediaDevices)
    console.log("Sorry, getUserMedia is not supported");
  else {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => { if (video.current && !video.current.srcObject) { video.current.srcObject = stream; } })
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