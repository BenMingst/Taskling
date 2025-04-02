import './style.css';
import { useTamagoFunctions } from './TamagoFunctions';
import tamagoImage from '../assets/tamagoChar';


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