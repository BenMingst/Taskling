import './style.css';
import { useTamagoFunctions } from './TamagoFunctions';
import tamagoImage from '../../public/assets/tamago1.png';
import tamagoCookie from '../../public/assets/cookie.png';
import tamagoGreyCookie from '../../public/assets/cookie_no_eat.png';


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