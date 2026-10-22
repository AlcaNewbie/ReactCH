export default function Navbar({ menu, setMenu }) {
  return (
    <nav className="nav">
      <div className="brand">RCH <span>v1</span></div>
      <div className="nav-links">
        <button className={menu === 'react' ? 'active' : ''} onClick={() => setMenu('react')}>React</button>
        <button className={menu === 'docs' ? 'active' : ''} onClick={() => setMenu('docs')}>Docs</button>
      </div>
    </nav>
  );
}
