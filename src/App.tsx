import nsidcLogo from '@src/assets/nsidc-logo.svg'
import '@src/App.css'

const App = () => (
  <>
    <div>
      <a href="https://nsidg.org" target="_blank" rel="noreferrer">
        <img src={nsidcLogo} className="logo nsidc" alt="NSIDC logo" />
      </a>
    </div>
    <h1>Arctic Rain on Snow Study (AROSS) - Automated Surface Observation Station (ASOS) Events Database</h1>
  </>
);

export default App
