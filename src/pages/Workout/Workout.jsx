import Stream from '../Stream/Stream';
import workout from './workout.json';
import React, { useState } from 'react';

export default function Workout() {
  const [currReps, changeRep] = useState(0);
  const [currSets, changeSets] = useState(0);
  const [currWorkout, changeWorkout] = useState(0);
  const { id, title, reps, sets, vpt } = workout[0];

  const nextRep = () => {
    console.log("nextRep");
    changeRep((currReps + 1));
    if ((currReps + 1) % reps === 0) {
      changeSets(currSets + 1);
    }
    if (currSets + 1 === sets) {
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
            <p id="workout-title">Current Set: {currReps}</p>
            <p id="upcoming">Upcoming: {currWorkout + 1 < workout.length ? workout[currWorkout + 1].title : "Last set!"}</p>
          </div> :
          <button id="next-button">Next →</button>
      }
      <canvas />
    </>
  );
}