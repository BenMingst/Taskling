import './style.css';
import { useEffect } from 'react';
import { useTamagoFunctions } from './TamagoFunctions';
import tamagoImage from '../../public/assets/tamago1.png';
import tamagoCookie from '../../public/assets/cookie.png';
//import tamagoGreyCookie from '../../public/assets/cookie_no_eat.png';


const Tamago = () => {
  const { petImageRef, cookieImageRef, numCookiesRef, updateNum, doRockingAnim, doFeedingAnim } = useTamagoFunctions();

  useEffect(() => {
    updateNum();
  }, []);

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
      
        <div className="CookieBox" id="Cookie">
          <label id="CookieCount">0</label>
          <button onClick={doFeedingAnim} className="CookieButton">
            <img
              ref={cookieImageRef}
              id="CookieImage"
              src={tamagoCookie}
              alt="Cookie"
            />
          </button>
        </div>
      </center>
    </>
  );
};

export default Tamago;