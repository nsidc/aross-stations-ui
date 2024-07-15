import {useState} from 'react';

import {Splash} from '@src/Splash.tsx'
import {Map} from '@src/Map.tsx'


const App = () => {
  const [splash, setSplash] = useState<boolean>(true);

  const SplashComponent = <Splash onButton={() => {setSplash(false)}} />;
  const VisibleComponent = splash ? SplashComponent : <Map />;

  return (
    <>
      {VisibleComponent}
    </>
  );
};

export default App
