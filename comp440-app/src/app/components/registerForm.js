"use client";

import Link from 'next/link';
import { Alert, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { useState } from 'react';

const RegisterForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const router = useRouter();

    const registerSuccess = () => {
        router.push("/");
    }

    const handleRegister = (userObj) => {
        fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userObj)
        }).then(response => {
            console.log(response.ok);
            if (response.ok) {
                registerSuccess();
                return;
            }
            return response.json();
        })
        .then(json => {
            if (json && json.message) {
                setAlertText(json.message);
                setAlert(true);
            }
        })
        .catch(err => console.log(err));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setAlert(false);

        if (password !== confirmPassword) {
            setAlertText("Passwords do not match.");
            setAlert(true);
            return;
        }

        //Save input at time of submission
        const userObj = {
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName,
            email: email
        };

        handleRegister(userObj);
    }

    return (
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={10}>
            <form id="registerForm" onSubmit={handleSubmit}>
                <Grid container spacing={2} maxWidth={400}>
                <Grid item xs={12} marginBottom={4}>
                    <Typography textAlign={"center"} variant={"h5"}>Register</Typography>
                </Grid>
                {alert ? <Grid item xs={12}><Alert severity="error">{alertText}</Alert></Grid> : <></>}
                <Grid item xs={6}>
                    <TextField 
                    required 
                    id="firstNameInput" 
                    label="First Name"
                    variant="outlined"
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                    required 
                    id="lastNameInput"
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        required 
                        id="emailInput" 
                        label="Email" 
                        variant="outlined" 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        required 
                        id="usernameInput" 
                        label="Username" 
                        variant="outlined" 
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        required 
                        id="passwordInput" 
                        label="Password" 
                        variant="outlined" 
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        required 
                        id="password2Input" 
                        label="Confirm Password" 
                        variant="outlined" 
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={confirmPassword !== password}
                        fullWidth />
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Button type="submit" variant="outlined">
                        Sign up
                    </Button>
                </Grid>
                </Grid>
            </form>
            <Stack direction={"row"} alignItems={"center"} paddingTop={5}>
                <Typography>Already have an account?</Typography>
                <Link href={"/"}>
                    <Button variant="text">Login</Button>
                </Link>
            </Stack>
    </Stack>
    );
}

export default RegisterForm;