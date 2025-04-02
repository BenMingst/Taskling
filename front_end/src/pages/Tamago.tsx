import './style.css';
import { useTamagoFunctions } from './TamagoFunctions';

const Tamago = () => {
  const { petImageRef, doRockingAnim } = useTamagoFunctions();

  return (
    <>
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
    </>
  );
};

export default Tamago;