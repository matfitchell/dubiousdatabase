"use client";

import { Container, Button, Grid, Typography } from "@mui/material";

const Dashboard = () => {
    const handleInitializeDb = () => {
        fetch("http://localhost:5000/api/initializeDb", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(jsonData => console.log(jsonData))
        .catch(err => console.log(err));
    }

    return (
        <Container sx={{ paddingTop: "50px"}}>
            <Grid container spacing={3} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                <Grid item xs={12}>
                    <Typography textAlign={"center"} variant={"h4"}>Welcome {localStorage.getItem("user")}.</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" onClick={handleInitializeDb}>
                        Initialize Database
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard;