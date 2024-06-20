import React from "react";
import "../login/login.scss";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <section class="py-3 py-md-5 py-xl-8">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="mb-5">
              <h2 class="display-5 fw-bold text-center">Sign Up</h2>
              <p class="text-center m-0">
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <div class="row gy-5 justify-content-center">
              <div class="col-12 col-lg-5">
                <form action="#!">
                  <div class="row gy-3 overflow-hidden">
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control border-0 border-bottom rounded-0"
                          name="name"
                          id="name"
                          placeholder="Name"
                          required
                        />
                        <label for="name" class="form-label">
                          Name
                        </label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <input
                          type="email"
                          class="form-control border-0 border-bottom rounded-0"
                          name="email"
                          id="email"
                          placeholder="name@example.com"
                          required
                        />
                        <label for="email" class="form-label">
                          Email
                        </label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <input
                          type="password"
                          class="form-control border-0 border-bottom rounded-0"
                          name="password"
                          id="password"
                          value=""
                          placeholder="Password"
                          required
                        />
                        <label for="password" class="form-label">
                          Password
                        </label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <input
                          type="password"
                          class="form-control border-0 border-bottom rounded-0"
                          name="password"
                          id="confirmPassword"
                          value=""
                          placeholder="Confirm Password"
                          required
                        />
                        <label for="confirmPassword" class="form-label">
                          Confirm Password
                        </label>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="submit">
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
