import React from 'react';
import Video from '../../components/Video.jsx';
import * as tf from '@tensorflow/tfjs';

export default function Workout() {
  let model;
  const threshold = 0.2;

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
      let keypoints = dataToKeyPoints(data, width, height);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);
      drawKeypoints(ctx, keypoints, threshold);
      drawKeyLines(ctx, keypoints, threshold);

      data = null;
      keypoints = null;
    });

    tf.nextFrame().then(() => detect(video, ctx, width, height));
  }

  const predict = (video) => {
    const input = tf.browser.fromPixels(video).resizeNearestNeighbor([256, 256]).toInt().expandDims();
    const output = model.predict(input);
    const data = output.dataSync();
    input.dispose();
    output.dispose();
    tf.disposeVariables();
    return data;
  }

  const dataToKeyPoints = (data, width, height) => {
    const keypoints = [];
    for (let i = 0; i < data.length; i += 3) {
      keypoints.push({
        position: {
          x: data[i + 1] * width,
          y: data[i] * height
        },
        score: data[i + 2]
      });
    }
    return keypoints;
  }

  const drawKeypoints = (ctx, keypoints, threshold) => {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < threshold)
        continue;
      const { x, y } = keypoint.position;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }

  const drawKeyLines = (ctx, keypoints, threshold) => {
    const connections = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [0, 5],
      [0, 6],
      [5, 7],
      [7, 9],
      [6, 8],
      [8, 10],
      [5, 6],
      [5, 11],
      [6, 12],
      [11, 12],
      [11, 13],
      [13, 15],
      [12, 14],
      [14, 16],
    ]
    for (let i = 0; i < connections.length; i++) {
      const keypoint1 = keypoints[connections[i][0]];
      const keypoint2 = keypoints[connections[i][1]];
      if (keypoint1.score < threshold || keypoint2.score < threshold)
        continue;
      const { x: x1, y: y1 } = keypoint1.position;
      const { x: x2, y: y2 } = keypoint2.position;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'green';
      ctx.stroke();
    }
  }



  return (
    <div className="workout dark-color-bg">
      <Video playCallback={startDetecting} />
      <canvas id="output" width="100px" height="100px" />
    </div>
  );
}