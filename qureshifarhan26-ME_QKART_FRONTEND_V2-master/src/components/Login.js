import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history=useHistory();
  const [isLoading,setIsloading]=useState(false);



  const [formData, setformData] = useState({
    username: "",
    password: "",
  });

  const handleData = (e) => {
    let [key, value] = [e.target.name, e.target.value];
    setformData({ ...formData, [key]: value });
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {

    if (!validateInput(formData)) return;


    try {
      setIsloading(true);

      let url = `${config.endpoint}/auth/login`;
      let response= await axios.post(url,formData);

      setformData({
        username: "",
        password: "",
      });
      setIsloading(false);
      const resToken=response.data.token;
      const resUsername=response.data.username;
      const resBalance=response.data.balance;

      persistLogin(resToken,resUsername,resBalance);



      enqueueSnackbar("Logged in  Successfully", { variant: "success" });
      history.push("/")
    } catch (e) {
      // setIsloading(false);
      

      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } 
      else {
        enqueueSnackbar("Username is already taken", { variant: "error" });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {

    if (formData.username.length === 0) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }


    if (formData.password.length === 0) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    
    
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
          <TextField
            value={formData.username}
            onChange={handleData}
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Username"
            fullWidth
          />
          <TextField
            value={formData.password}
            onChange={handleData}
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Password"
          />
          {isLoading?<Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="primary" value={25} />
          </Box>:
            <Button
            className="button"
            variant="contained"
            onClick={async (e) => {
              await login(formData);
            }}
          >
            Login to QKART
          </Button>}
          <p className="secondary-action">
          Don't have an account?{" "}
            {/* <a className="link" href="/">
              Register now
            </a> */}
            <Link className="link" to="/Register">Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />  
    </Box>
    
    
  );
};

export default Login;
