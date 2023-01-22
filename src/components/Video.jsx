import React from 'react';

const constraints = {
  audio: false,
  video: {
    aspectRatio: 1,
    width: { max: 600 },
    height: { max: 600 },
    // facingMode: 'environment' // or 'environment'
    deviceId: { exact: '8834c0baaf0dbecefbcfbb5831bc76f2a6ddac992803a36c36e8917014709c29' } // webcam
    // deviceId: { exact: '4a219b2d248c56c039e55cb378188fef9514fb8be5eb3731472bcb74352185ea' } // mac
  }
}

function Video(props) {
  let video = React.createRef();

  const playVideo = () => {
    video.current.play()
    props.playCallback()
  };

  // navigator.mediaDevices.enumerateDevices()
  // .then(devices => {
  //   devices.forEach(device => {
  //     if (device.kind === 'videoinput') {
  //       console.log(device.deviceId);
  //       console.log(device.label);
  //       console.log(device.kind);
  //     }
  //   });
  // })

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