import Stream from '../Stream/Stream';
import workout from './workout.json';
import React from 'react';

export default function Workout() {
  const nextRep = () => {
    console.log("nextRep");
  }

  const alert = () => {
    console.log("alert");
  }

  return (
    <div>
      <Stream name={workout[0].name} vpt={workout[0].vpt} nextRep={nextRep} alert={alert} />
    </div>
  );
}