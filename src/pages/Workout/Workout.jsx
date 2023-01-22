import Stream from '../Stream/Stream';
import workout from './workout.json';
import React, { useState } from 'react';

export default function Workout() {
  let [currReps, changeRep] = useState(0);
  let [currSets, changeSet] = useState(0);
  let [currWorkout, changeWorkout] = useState(0);
  let { id, title, reps, sets, vpt } = workout[0];

  const nextRep = () => {
    console.log("nextRep");
    changeRep((currReps + 1) % reps);
    if (currReps === 0) changeSet(currSets + 1);
    if (currSets === sets) {
      changeWorkout(currWorkout + 1);
      id = workout[currWorkout].name;
      title = workout[currWorkout].title;
      reps = workout[currWorkout].reps;
      sets = workout[currWorkout].sets;
      vpt = workout[currWorkout].vpt;
    }
  };

  const alert = () => {
    console.log("alert");
  };

  const draw = () => {
    window.requestAnimationFrame(draw);
  };
  draw();

  return (
    <>
      <Stream id={id} vpt={vpt} nextRep={nextRep} alert={alert} />
      {
        vpt ?
          <div id="info-container">
            <p id="workout-title">Current Set: {title}</p>
            <p id="upcoming">Upcoming: {currWorkout + 1 < workout.length ? workout[currWorkout + 1].title : "Last set!"}</p>
          </div> :
          <button id="next-button">Next →</button>
      }
      <canvas />
    </>
  );
}