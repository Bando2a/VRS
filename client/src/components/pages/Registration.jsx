import React, { useEffect, useState } from "react";
import { addUser } from "../services/venue.service";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [pass, setPass] = useState(false);
  const [repeatedPasswrd, setRepeatedPasswrd] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.password === repeatedPasswrd) {
      setPass(true);
    } else {
      setPass(false);
    }
  }, [data.password, repeatedPasswrd]);

  const submitReg = (e) => {
    e.preventDefault();

    data.username &&
      data.password &&
      data.email &&
      data.first_name &&
      data.last_name &&
      addUser(data).then(() => {
        alert("Registration ok!");
        navigate("/login");
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Register</h1>
              <form onSubmit={submitReg}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    required
                    placeholder="Enter username"
                    onChange={(e) =>
                      setData({ ...data, username: e.target.value })
                    }
                  />
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      id="firstName"
                      placeholder="Enter first name"
                      onChange={(e) =>
                        setData({ ...data, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      id="lastName"
                      placeholder="Enter last name"
                      onChange={(e) =>
                        setData({ ...data, last_name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="repeatPassword">Repeat Password</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    id="repeatPassword"
                    placeholder="Repeat password"
                    onChange={(e) => {
                      setRepeatedPasswrd(e.target.value);
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={!pass}
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

export default Registration;
