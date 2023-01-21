// text component
import React from 'react';

export default function Text(props) {
  return (
    <div id={props.id} className={"text " + props.className}>
      {props.children}
    </div>
  );
}