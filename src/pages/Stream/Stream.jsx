import React, { useState, useEffect } from 'react';
import Video from '../../components/Video.jsx';
import * as tf from '@tensorflow/tfjs';

export default function Stream({ id, vpt, nextRep, alertCallback, changePercentageCallback }) {
  const [model, setModel] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [repComplete, setRepComplete] = useState(false);
  let alerted = false;
  let repTime = 0;

  const threshold = 0.2;
  const keypoints = {
    nose: 0,
    l_eye: 1,
    r_eye: 2,
    l_ear: 3,
    r_ear: 4,
    l_shoulder: 5,
    r_shoulder: 6,
    l_elbow: 7,
    r_elbow: 8,
    l_wrist: 9,
    r_wrist: 10,
    l_hip: 11,
    r_hip: 12,
    l_knee: 13,
    r_knee: 14,
    l_ankle: 15,
    r_ankle: 16,
  }
  const connections = {
    // [0, 1],
    // [0, 2],
    // [1, 3],
    // [2, 4],
    // [0, 5],
    // [0, 6],
    l_bicep: [keypoints.l_shoulder, keypoints.l_elbow],
    l_forearm: [keypoints.l_elbow, keypoints.l_wrist],
    r_bicep: [keypoints.r_shoulder, keypoints.r_elbow],
    r_forearm: [keypoints.r_elbow, keypoints.r_wrist],
    shoulders: [keypoints.l_shoulder, keypoints.r_shoulder],
    l_side: [keypoints.l_shoulder, keypoints.l_hip],
    r_side: [keypoints.r_shoulder, keypoints.r_hip],
    hips: [keypoints.l_hip, keypoints.r_hip],
    l_thigh: [keypoints.l_hip, keypoints.l_knee],
    l_calf: [keypoints.l_knee, keypoints.l_ankle],
    r_thigh: [keypoints.r_hip, keypoints.r_knee],
    r_calf: [keypoints.r_knee, keypoints.r_ankle]
  }

  const loadModel = () => {
    tf.loadGraphModel(process.env.PUBLIC_URL + '/model/model.json').then((m) => {
      setModel(m);
    })
  }

  const getEndToEndLength = (line1, line2) => {
    return Math.sqrt(Math.pow(line1.x - line2.x, 2) + Math.pow(line1.y - line2.y, 2));
  }

  const getLineSlope = (line) => {
    return Math.abs(line.y / line.x);
  }

  const getLine = (keypoint1, keypoint2) => {
    return { x: keypoint2.position.x - keypoint1.position.x, y: keypoint2.position.y - keypoint1.position.y };
  }

  const getAngleBetweenLines = (line1, line2) => {
    const angle_rad = Math.atan2(line1.x * line2.y - line1.y * line2.x, line1.x * line2.x + line1.y * line2.y);
    return 180 - Math.abs(angle_rad * 180 / Math.PI);
  }

  const getLength = (line) => {
    return Math.sqrt(Math.pow(line.x, 2) + Math.pow(line.y, 2));
  }

  const getKeypoints = (keypointData, connection) => {
    return [
      keypointData[connection[0]],
      keypointData[connection[1]]
    ];
  }

  const getConnectionData = (keypoint1, keypoint2, keypoint3, keypoint4) => {
    // returns angle, line1, line2, length1, length2, endToEndLength
    const { x: x1, y: y1 } = keypoint1.position;
    const { x: x2, y: y2 } = keypoint2.position;
    const { x: x3, y: y3 } = keypoint3.position;
    const { x: x4, y: y4 } = keypoint4.position;
    const line1 = { x: x2 - x1, y: y2 - y1 };
    const line2 = { x: x4 - x3, y: y4 - y3 };
    const angle = getAngleBetweenLines(line1, line2);
    const length1 = getLength(line1);
    const length2 = getLength(line2);
    const endToEndLength = getEndToEndLength({ x: x1, y: y1 }, { x: x4, y: y4 });
    return { angle, line1, line2, length1, length2, endToEndLength };
  }

  const vptExercises = {
    "right_bicep_curl": {
      connections: [connections.r_bicep, connections.r_forearm],
      highlightConnections: [[connections.r_bicep, connections.r_forearm]],
      endRepThreshold: 0.95,
      startRepThreshold: 0.05,
      calcExtension: (keypointData) => {
        // return Math.min((1 - endToEndLength / (length1 + length2)) / 0.5, 1);
        const [keypoint1, keypoint2] = getKeypoints(keypointData, connections.r_bicep);
        const [keypoint3, keypoint4] = getKeypoints(keypointData, connections.r_forearm);
        const { length1, length2, endToEndLength } = getConnectionData(keypoint1, keypoint2, keypoint3, keypoint4);
        return Math.min((1 - endToEndLength / (length1 + length2)) / 0.5, 1);
      },
      alert: (keypointData) => { }
    },
    "left_bicep_curl": {
      connections: [connections.l_bicep, connections.l_forearm],
      highlightConnections: [[connections.l_bicep, connections.l_forearm]],
      endRepThreshold: 0.95,
      startRepThreshold: 0.05,
      calcExtension: (keypointData) => {
        // return Math.min((1 - endToEndLength / (length1 + length2)) / 0.5, 1);
        const [keypoint1, keypoint2] = getKeypoints(keypointData, connections.l_bicep);
        const [keypoint3, keypoint4] = getKeypoints(keypointData, connections.l_forearm);
        const { length1, length2, endToEndLength } = getConnectionData(keypoint1, keypoint2, keypoint3, keypoint4);
        return Math.min((1 - endToEndLength / (length1 + length2)) / 0.5, 1);
      },
      alert: (keypointData) => { }
    },
    "squats": {
      connections: [connections.r_thigh, connections.r_calf],
      highlightConnections: [[connections.r_thigh, connections.r_calf], [connections.l_thigh, connections.l_calf]],
      endRepThreshold: 0.95,
      startRepThreshold: 0.05,
      calcExtension: (keypointData) => {
        // return 1 - Math.max(angle - 90, 0) / 90
        const [keypoint1, keypoint2] = getKeypoints(keypointData, connections.r_thigh);
        const [keypoint3, keypoint4] = getKeypoints(keypointData, connections.r_calf);
        const { angle } = getConnectionData(keypoint1, keypoint2, keypoint3, keypoint4);
        return 1 - Math.max(angle - 90, 0) / 90;
      },
      alert: (keypointData) => {
        const [keypoint1, keypoint2] = getKeypoints(keypointData, connections.r_side);
        const line = getLine(keypoint1, keypoint2);
        const slope = getLineSlope(line);
        if (slope < 0.3 && !alerted) {
          alertCallback('Keep your back straight')
          alerted = true;
        }
      }
    },
  }

  const startDetecting = () => {
    if (!vpt) {
      console.log('vpt not supported');
      return;
    }

    setIsRunning(true);
  }

  const detect = (video, ctx, width, height) => {
    tf.tidy(() => {
      let data = predict(video);
      let keypointData = dataToKeypointData(data, width, height);
      const vptExercise = vptExercises[id];
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);
      drawKeypoints(ctx, keypointData, threshold);
      drawKeyLines(ctx, keypointData, threshold);
      highlightConnections(ctx, keypointData, vptExercise.highlightConnections, threshold);
      extension(ctx, keypointData, ...vptExercise.connections, vptExercise.calcExtension, vptExercise.endRepThreshold, vptExercise.startRepThreshold, threshold);
      vptExercise.alert(keypointData)
    });

    // tf.nextFrame().then(() => detect(video, ctx, width, height));
  }

  const predict = (video) => {
    const input = tf.browser.fromPixels(video).resizeNearestNeighbor([256, 256]).toInt().expandDims();
    const output = model.predict(input);
    const data = output.dataSync();
    return data;
  }

  const dataToKeypointData = (data, width, height) => {
    const keypointData = [];
    for (let i = 0; i < data.length; i += 3) {
      keypointData.push({
        position: {
          x: data[i + 1] * width,
          y: data[i] * height
        },
        score: data[i + 2]
      });
    }
    return keypointData;
  }

  const drawKeypoints = (ctx, keypointData, threshold) => {
    for (let i = 0; i < keypointData.length; i++) {
      if (keypointData[i].score < threshold)
        continue;
      const { x, y } = keypointData[i].position;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }

  const drawKeyLines = (ctx, keypointData, threshold) => {
    for (let i in connections) {
      const keypoint1 = keypointData[connections[i][0]];
      const keypoint2 = keypointData[connections[i][1]];
      if (keypoint1.score < threshold || keypoint2.score < threshold)
        continue;
      const { x: x1, y: y1 } = keypoint1.position;
      const { x: x2, y: y2 } = keypoint2.position;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = 'cyan';
      ctx.stroke();
    }
  }

  const highlightConnections = (ctx, keypointData, connectionsList, threshold) => {
    for (let i in connectionsList) {
      for (let j in connectionsList[i]) {
        const keypoint1 = keypointData[connectionsList[i][j][0]];
        const keypoint2 = keypointData[connectionsList[i][j][1]];
        if (keypoint1.score < threshold || keypoint2.score < threshold)
          continue;
        const { x: x1, y: y1 } = keypoint1.position;
        const { x: x2, y: y2 } = keypoint2.position;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'purple';
        ctx.stroke();
      }
    }
  }

  const extension = (ctx, keypointData, connection_1, connection_2, calcExtension, endRepThreshold, startRepThreshold, threshold) => {
    // get the keypoints
    const [keypoint1, keypoint2] = getKeypoints(keypointData, connection_1);
    const [keypoint3, keypoint4] = getKeypoints(keypointData, connection_2);

    if (keypoint1.score < threshold || keypoint2.score < threshold || keypoint3.score < threshold || keypoint4.score < threshold)
      return;

    const extensionAmount = calcExtension(keypointData);

    changePercentageCallback(extensionAmount * 100);

    if (extensionAmount > endRepThreshold && !repComplete) {
      nextRep();
      if (repTime < 0.5) {
        alertCallback('You are going too fast! Try to slow down a bit.')
      }
      setRepComplete(true);
    } else if (extensionAmount < startRepThreshold) {
      repTime = 0;
      if (repComplete)
        setRepComplete(false);
    }
  }

  if (model && !isRunning)
    startDetecting();

  useEffect(() => {
    let intervalId;
    let previousTime = performance.now();

    if (isRunning) {
      const video = document.getElementById('video');
      const canvas = document.getElementById('output');
      const ctx = canvas.getContext('2d');
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      intervalId = setInterval(() => {
        const currentTime = performance.now();
        const deltaTime = currentTime - previousTime;
        detect(video, ctx, width, height, deltaTime);
        previousTime = currentTime;
        repTime += deltaTime / 1000;
      }, 10);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  });


  return (
    <div className="workout dark-color-bg">
      <Video playCallback={loadModel} />
      <canvas id="output" width="100px" height="100px" />
    </div>
  );
}