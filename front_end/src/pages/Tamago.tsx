import './style.css';
import { useTamagoFunctions } from './TamagoFunctions';
import tamagoImage from 'front_end\src\assets\tamago1.png';


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
              src={tamagoImage}
              alt="Pet"
            />
          </button>
        </div>
      </center>
    </>
  );
};

export default Tamago;