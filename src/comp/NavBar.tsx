export default function NavBar() {
  return (
    <div className="navbar bg-base-300">
      <div className="">
        <span className="btn btn-ghost text-xl">StreamTracker v2.0</span>
      </div>
      <div className="flex flex-1 gap-5">
        <a className="link" href="/">
          Kanaly
        </a>
        <a className="link" href="/serwisy">
          Serwisy
        </a>
      </div>
    </div>
  );
}
