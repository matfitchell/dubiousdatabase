"use client";

import { Container, Button, Grid, Typography, Stack } from "@mui/material";
import { useState } from "react";
import Form2 from "../components/sqlComponents/form2";
import List1 from "../components/sqlComponents/list1";
import Form3 from "../components/sqlComponents/form3";
import Form4 from "../components/sqlComponents/form4";
import Form5 from "../components/sqlComponents/form5";
import List6 from "../components/sqlComponents/list6";
import List7 from "../components/sqlComponents/list7";
import List8 from "../components/sqlComponents/list8";
import List9 from "../components/sqlComponents/list9";
import Pair10 from "../components/sqlComponents/pair10";

const Dashboard = () => {
    const [component, setComponent] = useState(<></>);

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

    const sqlNavButtons = [
        { name: "1. Expensive Items Per Category", component: <List1/> },
        { name: "6. Never Posted Excellent Items", component: <List6/>},
        { name: "2. Category X and Y Same Day", component: <Form2/>},
        { name: "7. Never Posted Poor Review", component: <List7/>},
        { name: "3. All Items Posted Good or Better", component: <Form3/>},
        { name: "8. Only Posted Poor Reviews", component: <List8/>},
        { name: "4. Most Items on Date", component: <Form4/>},
        { name: "9. Never Poor Reviews", component: <List9/>},
        { name: "5. Users Favorited By Two Users", component: <Form5/>},
        { name: "10. Pair Always Excellent", component: <Pair10/>}
    ]

    return (
        <Container sx={{ paddingTop: "50px" }} maxWidth="md">
            <Grid container spacing={3} direction={"column"} justifyContent={"center"} alignItems={"center"} marginBottom={10}>
                <Grid item xs={12}>
                    <Typography textAlign={"center"} variant={"h4"}>Welcome {localStorage.getItem("user")}.</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" onClick={handleInitializeDb}>
                        Initialize Database
                    </Button>
                </Grid>
            </Grid>
            {component}
            <Grid container spacing={2} direction={"row"} justifyContent={"start"} alignItems={"center"} textAlign={"left"}>
                {sqlNavButtons.map((button, index) => 
                    <Grid item xs={6} key={index}>
                        <Button fullWidth variant="outlined" onClick={() => setComponent(button.component)}>{button.name}</Button>
                    </Grid>
                )}
            </Grid>
        </Container>
    )
}

export default Dashboard;