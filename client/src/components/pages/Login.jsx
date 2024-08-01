import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/venue.service";

function Login() {
  const [data, setData] = useState({
    identifier: "", // Can be either username or email
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    data.identifier &&
      data.password &&
      loginUser(data)
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          alert("LOGGED IN!");
          navigate("/home");
        })
        .catch((err) => alert("Account Not Found!"));
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Login</h1>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="identifier">Username or Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="identifier"
                    required
                    placeholder="Enter username or email"
                    onChange={(e) =>
                      setData({ ...data, identifier: e.target.value })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    required
                    placeholder="Enter password"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100 mb-3">
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    navigate(`/register`);
                  }}
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
