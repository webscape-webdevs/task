import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../Loader/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import {  userLogin, userRegister } from "../../slices/sessionSlice";
import { useAlert } from "react-alert";


const LoginSignUp = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector((state) => state.sessionSlice);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [accNumber, setAccountNumber] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    accountNumber: "",
    password: "",
    organizationName: "",
  });

  const { firstName, lastName, accountNumber, password } = user;

  const userLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin({ accNumber, userPassword }));
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("firstName", firstName);
    myForm.set("lastName", lastName);
    myForm.set("accountNumber", accountNumber);
    myForm.set("password", password);

    // let userData = { firstName, lastName, email, password, organizationName, selectedOption, avatar };
    dispatch(userRegister({ myForm }));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/dashboard";

  useEffect(() => {
    if (error) {
      alert.error(error);
    }

    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [dispatch, error, alert, history, isAuthenticated, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Fragment>
            <div className="LoginSignUpContainer">
              <div className="LoginSignUpBox">
                <div>
                  <div className="login_signUp_toggle">
                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                    <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                  </div>
                  <button ref={switcherTab}></button>
                </div>
                <div className="loginSignupDiv">
                  {/* ---------------------Login ---------------------*/}

                  <div className="loginFormContainer" ref={loginTab}>
                    <form className="loginForm" onSubmit={userLoginSubmit}>
                      <div className="loginEmail">
                        <MailOutlineIcon />
                        <input type="text" placeholder="Account Number" required value={accNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                      </div>
                      <div className="loginPassword">
                        <LockOpenIcon />
                        <input type="password" placeholder="Password" required value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                      </div>

                      <input type="submit" value="Login" className="loginBtn" />
                    </form>

                  </div>

                  {/* ---------------------Signup ---------------------*/}
                  <div className="signUpFormContainer" ref={registerTab}>
                    <form className="signUpForm" encType="multipart/form-data" onSubmit={registerSubmit}>
                      <div className="signUpFirstName">
                        <FaceIcon />
                        <input type="text" placeholder="First Name" required name="firstName" value={firstName} onChange={registerDataChange} />
                      </div>
                      <div className="signUpLastName">
                        <FaceIcon />
                        <input type="text" placeholder="Last Name" required name="lastName" value={lastName} onChange={registerDataChange} />
                      </div>
                      <div className="signUpEmail">
                        <MailOutlineIcon />
                        <input type="text" placeholder="Account Number" required name="accountNumber" value={accountNumber} onChange={registerDataChange} />
                      </div>
                      <div className="signUpPassword">
                        <LockOpenIcon />
                        <input type="password" placeholder="Password" required name="password" value={password} onChange={registerDataChange} />
                      </div>
                
                      <input type="submit" value="Register" className="signUpBtn" />
                    </form>
                  </div>
                </div>
                {/* ---------------------Signup END ---------------------*/}
              </div>
            </div>
          </Fragment>
        </>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
