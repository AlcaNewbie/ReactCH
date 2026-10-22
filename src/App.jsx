import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ReactMenu from './components/ReactMenu.jsx';
import DocsMenu from './components/DocsMenu.jsx';

export default function App() {
  const [menu, setMenu] = useState('react');
  return (
    <>
      <Navbar menu={menu} setMenu={setMenu} />
      <main className="container">
        {menu === 'react' && <ReactMenu />}
        {menu === 'docs' && <DocsMenu />}
      </main>
      <footer className="footer">
        Credits: <a href="https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44" target="_blank" rel="noreferrer">AlcaW44</a>
      </footer>
    </>
  );
}
