"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button, Grid, Stack, TextField, Typography, Alert } from '@mui/material';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState("");

    const handleLogin = (username, password) => {
        const userObj = {
            username: username,
            password: password
        };

        fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userObj)
        }).then(response => {
          if (response.ok) {
            onLogin({user: username});
            return;
          }
          return response.json();
        })
        .then(jsonData => {
          if (jsonData && jsonData.message) {
            setAlert(true);
            setAlertText(jsonData.message);
          }
        })
        .catch(err => console.log(err));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the handleLogin function with the entered username and password
        handleLogin(username, password);
    };

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={10}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} maxWidth={400}>
          <Grid item xs={12} marginBottom={4}>
            <Typography textAlign={"center"} variant={"h5"}>Login</Typography>
          </Grid>
          {alert ? <Grid item xs={12}><Alert severity="error">{alertText}</Alert></Grid> : <></>}
          <Grid item xs={12}>
            <TextField 
              required 
              id="username" 
              label="Username"
              variant="outlined"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              required 
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth />
          </Grid>
          <Grid item xs={12} textAlign={"center"}>
            <Button type="submit" variant="outlined">
              Sign in
            </Button>
          </Grid>
        </Grid>
      </form>
      <Stack direction={"row"} alignItems={"center"} paddingTop={5}>
        <Typography>Don't have an account?</Typography>
        <Link href={"/register"}>
          <Button variant="text">Register</Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default LoginForm;