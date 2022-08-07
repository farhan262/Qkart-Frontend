import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ( {children,hasHiddenAuthButtons} ) => {
  const routeChange = (e) =>{ 
    history.push("/");
  }

  const routeChangeRegister = () =>{ 
    history.push("/register");
  }

  const routeChangeLogin = () =>{ 
    history.push("/login");
  }



  const history= useHistory();

  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    history.push("/");
    window.location.reload();
  };

  if(hasHiddenAuthButtons){
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        <Button
        
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={routeChange}
          >
          Back to explore
        </Button>
      </Box>
    );
  }




  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      <Stack direction="row" spacing={1} alignItems="center">
      {localStorage.getItem("username") ? (
        <>
          <Avatar alt={localStorage.getItem("username")} src="avatar.png" />
          <p className="username-text"> {localStorage.getItem("username")}</p>
          <Button onClick={logout}>logout</Button>
        </>
      ) : (
        <>
          <Button onClick={routeChangeLogin}>Login</Button>
          <Button variant="contained" onClick={routeChangeRegister}>Register</Button>
        </>
      )}
      </Stack>
    </Box>
  );
};

export default Header;
