import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand py-2 px-4" href="/">
          VRS
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto px-4">
            {user ? (
              <>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle mx-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.user.username}
                  </button>
                  <ul className="dropdown-menu">
                    {user.user.is_admin === 1 && (
                      <a className="dropdown-item text-success">Admin</a>
                    )}
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/profile/${user.user.user_id}`}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/stats">
                        Stats
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" onClick={logout}>
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <li className="nav-item active">
                  <a className="nav-link " href="/register">
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
