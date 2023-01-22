import Stream from '../Stream/Stream';
import workout from './workout.json';
import React, { useRef } from 'react';

export default function Workout() {
  let currReps = 0, currSets = 0, currWorkout = 0;
  const workoutTitle = useRef();
  const upcoming = useRef();
  const progressbar = useRef();

  const nextRep = () => {
    console.log("nextRep");
    currReps++;
    currReps %= workout[currWorkout].reps;
    if (currReps === 0) {
      currSets++;
      currSets %= workout[currWorkout].sets;
      console.log(currSets);
      if (currSets === 0) {
        currWorkout++;
        workoutTitle.current.innerText = "Current: " + workout[currWorkout].title;
        upcoming.current.innerText = currWorkout + 1 < workout.length ? "Upcoming: " + workout[currWorkout + 1].title : "Last set!";
      }
    }
  };

  const alert = () => {
    console.log("alert");
  };

  return (
    <>
      <Stream
        id={workout[currWorkout].id}
        vpt={workout[currWorkout].vpt}
        nextRep={nextRep}
        alert={alert}
        changePercentage={p => {
          progressbar.current.style = `--value:${p}`;
        }} />
      <div id="info-container">
        <p id="workout-title" ref={workoutTitle}>Current Set: {workout[0].title}</p>
        <p id="upcoming" ref={upcoming}>Upcoming: {workout[1].title}</p>
      </div>
      <div ref={progressbar} role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{ "--value": 50 }}></div>
      {/* <button id="next-button">Next →</button> */}
      <canvas />
    </>
  );
}