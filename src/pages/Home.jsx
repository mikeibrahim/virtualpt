import React from 'react';
import Text from '../components/Text.jsx';
import Button from '../components/Button.jsx';
import Route from "../components/Route.js";

export default function Home() {
  return (
    <div className="home dark-color-bg">
      <Text className="title primary-color">VirtualPT</Text>

      <Button className="primary-color-bg" onClick={() => Route('/workout')}>
        <Text className="light-color lg hide-mobile">Go</Text>
        <Text className="light-color lg hide-desktop">→</Text>
      </Button>
    </div>
  );
}