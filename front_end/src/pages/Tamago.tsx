import './style.css';
import { useTamagoFunctions } from './TamagoFunctions';

const Tamago = () => {
  const { petImageRef, doRockingAnim } = useTamagoFunctions();

  return (
    <>
      <center>
        <h1 className="TamagoTitle">Taskling</h1>
        <p className="TamagoSubtitle">Where Virtual Pets Meet Real Productivity</p>
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
    </>
  );
};

export default Tamago;