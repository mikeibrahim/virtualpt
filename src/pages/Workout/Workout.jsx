import Stream from '../Stream/Stream';
import workout from './workout.json';
import React, { useRef, useState } from 'react';

export default function Workout() {
  let currReps = 0, currSets = 0, currWorkout = 0;
  const workoutTitle = useRef(), upcoming = useRef();
  const setsCompleted = useRef(), progressbar = useRef();
  const [idvpt, setIdvpt] = useState([workout[0].id, workout[0].vpt]);

  console.log("asdf", idvpt)
  const nextRep = () => {
    console.log("nextRep");
    currReps++;
    currReps %= workout[currWorkout].reps;
    progressbar.current.setAttribute("data-center", currReps + "/" + workout[currWorkout].reps);
    if (currReps === 0) {
      currSets++;
      currSets %= workout[currWorkout].sets;
      setsCompleted.current.innerText = `Sets: ${currSets}/${workout[0].sets}`;
      console.log(currSets);
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
  };

  return (
    <>
      <Stream
        id={idvpt[0]} vpt={idvpt[1]}
        nextRep={nextRep} alert={alert}
        changePercentage={p => progressbar.current.style = `--value:${p}`} />
      <div id="info-container">
        <p id="workout-title" ref={workoutTitle}>Current Set: {workout[0].title}</p>
        <p id="upcoming" ref={upcoming}>Upcoming: {workout[1].title}</p>
        <p id="sets-completed" ref={setsCompleted}>Sets: 0/{workout[0].sets}</p>
        <div id="progressbar-container">
          <div ref={progressbar} role="progressbar"
            style={{ "--value": 0 }}>
            <p className="fraction">0/{workout[0].reps}</p>
            <p className="units">Reps</p>
          </div>
          <div ref={progressbar} role="progressbar"
            style={{ "--value": 0 }}>
            <p className="fraction">0/{workout[0].reps}</p>
            <p className="units">Reps</p>
          </div>
          <div ref={progressbar} role="progressbar"
            style={{ "--value": 0 }}>
            <p className="fraction">0/{workout[0].reps}</p>
            <p className="units">Reps</p>
          </div>
        </div>
      </div>
      {/* <button id="next-button">Next →</button> */}
      <canvas />
    </>
  );
}