import React from 'react';

export default function Button(props) {
  return (
    <button id={props.id} className={`button ${props.className}`} onClick={props.onClick}>
      {props.children}
    </button>
  );
}