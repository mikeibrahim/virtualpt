import Stream from '../Stream/Stream';
import workout from './workout.json';
import React, { useRef, useState } from 'react';

export default function Workout() {
  let currReps = 0, currSets = 0, currWorkout = 0;
  const workoutTitle = useRef(), upcoming = useRef();
  const progressbar1 = useRef(), progressbar2 = useRef(), progressbar3 = useRef();
  const alerts = useRef();
  const [idvpt, setIdvpt] = useState([workout[0].id, workout[0].vpt]);

  const nextRep = () => {
    console.log("nextRep");
    currReps++;
    currReps %= workout[currWorkout].reps;
    progressbar2.current.style = `--value:${currReps / workout[currWorkout].reps * 100}`;
    progressbar2.current.innerText = currReps + "/" + workout[currWorkout].reps;
    if (currReps === 0) {
      currSets++;
      currSets %= workout[currWorkout].sets;
      progressbar3.current.style = `--value:${currSets / workout[currWorkout].sets * 100}`;
      progressbar3.current.innerText = currSets + "/" + workout[currWorkout].sets;
      if (currSets === 0) {
        currWorkout++;
        workoutTitle.current.innerText = "Current: " + workout[currWorkout].title;
        upcoming.current.innerText = currWorkout + 1 < workout.length ? "Upcoming: " + workout[currWorkout + 1].title : "Last set!";
        setIdvpt(i => {
          console.log(i);
          return [workout[currWorkout].id, workout[currWorkout].vpt]
        });
      }
    }
  };

  const alert = () => {
    console.log("alert");
    alerts.current.appendChild();
  };

  return (
    <>
      <Stream
        id={idvpt[0]} vpt={idvpt[1]}
        nextRep={nextRep} alert={alert}
        changePercentage={p => {
          progressbar1.current.innerText = `${Math.round(p)}%`;
          progressbar1.current.style = `--value:${p}`;
        }} />
      <div id="info-container">
        <p id="workout-title" ref={workoutTitle}>Current Set: {workout[0].title}</p>
        <p id="upcoming" ref={upcoming}>Upcoming: {workout[1].title}</p>
        <div id="progressbar-container">
          <div ref={progressbar1} role="progressbar"
            style={{ "--value": 0 }}>
            0%
          </div>
          <div ref={progressbar2} role="progressbar"
            style={{ "--value": 0 }}>
            0/{workout[0].reps}
            <p className="units">Reps</p>
          </div>
          <div ref={progressbar3} role="progressbar"
            style={{ "--value": 0 }}>
            0/{workout[0].sets}
            <p className="units">Sets</p>
          </div>
        </div>
      </div>
      <div id="alerts" ref={alerts}></div>
      {/* <button id="next-button">Next →</button> */}
      <canvas />
    </>
  );
}