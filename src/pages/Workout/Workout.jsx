import React from 'react';
import Video from '../../components/Video.jsx';
import * as tf from '@tensorflow/tfjs';

export default function Workout() {
  let model;

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

  tf.loadGraphModel(process.env.PUBLIC_URL + '/model/model.json').then((m) => {
    model = m;
  });

  const startDetecting = () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    detect(video, ctx, canvas.width, canvas.height)
  }

  const detect = (video, ctx, width, height) => {
    tf.tidy(() => {
      let data = predict(video);
      let keypointData = dataToKeypointData(data, width, height);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);
      drawKeypoints(ctx, keypointData, threshold);
      drawKeyLines(ctx, keypointData, threshold);
      extension(ctx, keypointData, connections.r_bicep, connections.r_forearm, threshold)
    });

    tf.nextFrame().then(() => detect(video, ctx, width, height));
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

  const extension = (ctx, keypointData, connection_1, connection_2, threshold) => {
    // measure the angle between the two lines
    const keypoint1 = keypointData[connection_1[0]];
    const keypoint2 = keypointData[connection_1[1]];
    const keypoint3 = keypointData[connection_2[0]];
    const keypoint4 = keypointData[connection_2[1]];
    if (keypoint1.score < threshold || keypoint2.score < threshold || keypoint3.score < threshold || keypoint4.score < threshold)
      return;
    const { x: x1, y: y1 } = keypoint1.position;
    const { x: x2, y: y2 } = keypoint2.position;
    const { x: x3, y: y3 } = keypoint3.position;
    const { x: x4, y: y4 } = keypoint4.position;
    const line1 = { x: x2 - x1, y: y2 - y1 };
    const line2 = { x: x4 - x3, y: y4 - y3 };
    const line1Length = Math.sqrt(Math.pow(line1.x, 2) + Math.pow(line1.y, 2));
    const line2Length = Math.sqrt(Math.pow(line2.x, 2) + Math.pow(line2.y, 2));
    const endToEndLength = Math.sqrt(Math.pow(x1 - x4, 2) + Math.pow(y1 - y4, 2));
    const extensionAmount = endToEndLength / (line1Length + line2Length);
    // draw the lines
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'orange';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'orange';
    ctx.stroke();
    // draw the angle
    const angle = Math.atan2(line1.x * line2.y - line1.y * line2.x, line1.x * line2.x + line1.y * line2.y);
    const angle_deg = 180 + angle * 180 / Math.PI;
    ctx.beginPath();
    ctx.arc(x2, y2, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(angle_deg.toFixed(0), x2, y2);
    // draw the distance from the farthest points
    ctx.beginPath();
    ctx.arc(x4, y4, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(extensionAmount.toFixed(2), x4, y4);
  }

  return (
    <div className="workout dark-color-bg">
      <Video playCallback={startDetecting} />
      <canvas id="output" width="100px" height="100px" />
    </div>
  );
}