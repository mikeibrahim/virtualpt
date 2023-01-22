import Stream from '../Stream/Stream';
import workout from './workout.json';
import React, { useRef, useState } from 'react';
import warning from './warning.svg';

export default function Workout() {
  let currReps = 0, currSets = 0;
  const [currWorkout, setWorkout] = useState(0);
  const workoutTitle = useRef(), upcoming = useRef();
  const progressbar1 = useRef(), progressbar2 = useRef(), progressbar3 = useRef();
  const alerts = useRef();

  const nextRep = () => {
    console.log("nextRep");
    currReps++;
    currReps %= workout[currWorkout].reps;
    progressbar2.current.style = `--value:${currReps / workout[currWorkout].reps * 100}`;
    progressbar2.current.children[0].innerText = currReps + "/" + workout[currWorkout].reps;
    if (currReps === 0) {
      currSets++;
      currSets %= workout[currWorkout].sets;
      progressbar3.current.style = `--value:${currSets / workout[currWorkout].sets * 100}`;
      progressbar3.current.children[0].innerText = currSets + "/" + workout[currWorkout].sets;
      if (currSets === 0) {
        console.log("asdf", currWorkout, workout[currWorkout]);
        progressbar2.current.style = `--value:${currReps / workout[currWorkout + 1].reps * 100}`;
        progressbar2.current.children[0].innerText = currReps + "/" + workout[currWorkout + 1].reps;
        progressbar3.current.style = `--value:${currSets / workout[currWorkout + 1].sets * 100}`;
        progressbar3.current.children[0].innerText = currSets + "/" + workout[currWorkout + 1].sets;
        setWorkout(currWorkout + 1);
      }
    }
  };

  const alert = message => {
    console.log(`alert: ${message}`);
    // alerts.current.appendChild(<Alert message={message} />);
  };

  return (
    <>
      <Stream
        id={workout[currWorkout].id} vpt={workout[currWorkout].vpt}
        nextRep={nextRep} alertCallback={alert}
        changePercentageCallback={p => {
          progressbar1.current.children[0].innerText = `${Math.round(p)}%`;
          progressbar1.current.style = `--value:${p}`;
        }} />
      <div id="info-container">
        <p id="workout-title" ref={workoutTitle}>Current Set: {workout[currWorkout].title}</p>
        <p id="upcoming" ref={upcoming}>
          {currWorkout + 1 < workout.length ?
            `Upcoming: ${workout[currWorkout + 1].title}` :
            "Last set!"}</p>
        <div id="progressbar-container">
          <div ref={progressbar1} role="progressbar"
            style={{ "--value": 0 }}>
            <p className="fraction">0%</p>
          </div>
          <div ref={progressbar2} role="progressbar"
            style={{ "--value": 0 }}>
            <p className="fraction">0/{workout[0].reps}</p>
            <p className="units">Reps</p>
          </div>
          <div ref={progressbar3} role="progressbar"
            style={{ "--value": 0 }}>
            <p className="fraction">0/{workout[0].sets}</p>
            <p className="units">Sets</p>
          </div>
        </div>
      </div>
      <div id="alert-container" ref={alerts}></div>
      {/* <button id="next-button">Next →</button> */}
      <canvas />
    </>
  );
}

const Alert = message => (
  <div class="alert">
    <img src={warning} alt="Alert Icon" />
    {message}
  </div>
);