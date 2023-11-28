"use client";

import {Stack, Grid, TextField, Button} from "@mui/material";
import { useState } from "react";

const Form4 = () => {
    const testData = [
        {
            username: "Alice"
        },
        {
            username: "John"
        },
        {
            username: "Emma"
        }
    ]
    const [data, setData] = useState(testData); //usernames
    const [date, setDate] = useState("");

    const handleSubmit = (date) => {
        // fetch("http://localhost:5000/api/four", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ date: date })
        // }).then(response => response.json())
        // .then(json => {
        //     if (json && !json.message) {
        //         setData(json)
        //     }
        // })
        // .catch(err => console.log(err));
    }

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" marginBottom={2}>
            <Grid container spacing={1} width={275}>
                <Grid item xs={12}>
                    <TextField 
                        required 
                        label="Date (YYYY-MM-DD)"
                        variant="outlined"
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Button variant="outlined" onClick={() => handleSubmit(date)}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
            <ol>
            {data && data.map((user, index) => 
                <li key={index}>
                    <strong>Username:</strong> {" " + user.username}
                </li>
            )}
            </ol>
        </Stack>
    )
}

export default Form4;