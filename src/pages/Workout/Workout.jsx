import Stream from '../Stream/Stream';
import workout from './workout.json';
import React from 'react';

export default function Workout() {
  const [currentExercise, setCurrentExercise] = React.useState(0);
  const [currentRep, setCurrentRep] = React.useState(0);

  const nextRep = () => {
    console.log("nextRep");
    setCurrentRep(currentRep + 1);
  }

  const alert = () => {
    console.log("alert");
  }

  return (
    <div>
      <Stream exercise={workout[currentExercise]} nextRep={nextRep} alert={alert} />
    </div>
  );
}