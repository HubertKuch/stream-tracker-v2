import './App.css';
import NavBar from './comp/NavBar';
import './index.css';

function Template({ children, refresh }: { children: any; refresh: any }) {
  return (
    <div className="App">
      <NavBar refresh={refresh} />
      <main className="p-10">{children}</main>
    </div>
  );
}

export default Template;
