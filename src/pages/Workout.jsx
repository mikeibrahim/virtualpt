import React from 'react';
import Text from '../components/Text.jsx';
// import Button from '../components/Button.jsx';
// import Route from "../components/Route.js";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

export default function Workout() {
  console.log(poseDetection);
  tf.loadGraphModel(process.env.PUBLIC_URL + '/model/model.json').then(model => {
    console.log(model);
  });

  return (
    <div className="workout dark-color-bg">
      <Text className="title primary-color">Workout</Text>

      
    </div>
  );
}