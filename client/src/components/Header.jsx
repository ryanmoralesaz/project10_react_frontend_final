const isSignedIn = true;

export default function Header({ href, Username = "Joe Smith" }) {
  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <a href="">Courses</a>
        </h1>
        <nav>
          {isSignedIn ? (
            <ul className="header--signedin">
              <li>Welcome, {Username}!</li>
              <li>
                <a href="">Sign Out</a>
              </li>
            </ul>
          ) : (
            <ul className="header--signedout">
              <li>
                <a href="">Sign Up</a>
              </li>
              <li>
                <a href="">Sign In</a>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
