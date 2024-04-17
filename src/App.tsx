import './App.css';
import NavBar from './comp/NavBar';
import './index.css';

function Template({ children }: { children: any }) {
  return (
    <div className="App">
      <NavBar />
      <main className="p-10">{children}</main>
    </div>
  );
}

export default Template;
