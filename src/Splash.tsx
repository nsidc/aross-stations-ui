import nsidcLogo from '@src/assets/nsidc-logo.svg'
import '@src/Splash.css'

interface SplashProps {
  onButton: () => void;
}

export const Splash = (props: SplashProps) => (
  <div className="Splash">
    <div>
      <a href="https://nsidg.org" target="_blank" rel="noreferrer">
        <img src={nsidcLogo} className="logo nsidc" alt="NSIDC logo" />
      </a>
    </div>
    <h1>
      Arctic Rain on Snow Study (AROSS)
      <br />
      Automated Surface Observation Station (ASOS) Events Database
    </h1>
    <div>
      <button onClick={props.onButton}>Let&apos;s go!</button>
    </div>
  </div>
);
