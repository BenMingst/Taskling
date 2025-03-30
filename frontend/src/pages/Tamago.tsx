import React, { useState, useRef } from 'react';
import './style.css'; // Import the external CSS file

const Tamago: React.FC = () => {
  const [petAnimPlaying, setPetAnimPlaying] = useState(false);
  const petImageRef = useRef<HTMLImageElement>(null);

  const startRockingAnim = (element: HTMLElement | null) => {
    if (element) {
      element.style.animationPlayState = "running";
      element.style.animationIterationCount = "infinite";
    }
  };

  const endRockingAnim = (element: HTMLElement | null) => {
    if (element) {
      element.style.animationPlayState = "paused";
    }
  };

  const doRockingAnim = () => {
    if (!petAnimPlaying) {
      setPetAnimPlaying(true);
      const pet = petImageRef.current;

      startRockingAnim(pet);
      setTimeout(() => {
        if (pet) {
          pet.style.animationPlayState = "paused";
          pet.style.animationIterationCount = "0";
        }
        setPetAnimPlaying(false);
      }, 1750);
    }
  };

  return (
    <div>
      <head>
        <title>Taskling: Tamago</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Modak&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Iansui&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <center>
          <h1 className="TamagoTitle">Taskling</h1>
        </center>
        <center>
          <p className="TamagoSubtitle">Where Virtual Pets Meet Real Productivity</p>
        </center>
        <center>
          <div className="PetEnviroment">
            <button onClick={doRockingAnim} className="PetButton">
              <img
                ref={petImageRef}
                id="PetImage"
                src="../assets/tamago1.png"
                alt="Pet"
              />
            </button>
          </div>
        </center>
      </body>
    </div>
  );
};

export default Tamago;