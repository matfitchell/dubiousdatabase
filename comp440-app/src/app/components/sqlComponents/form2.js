"use client";

import {Grid, Button, TextField, Stack} from "@mui/material"; 
import { useState } from "react";

const Form2 = () => {
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

    const [cat1, setCat1] = useState("");
    const [cat2, setCat2] = useState("");
    const [data, setData] = useState(testData);

    const handleSubmit = () => {
        // const params = new URLSearchParams ({
        //     category1: cat1,
        //     category2: cat2
        // })

        // fetch(`http://localhost:5000/api/two?${params}`, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // }).then(response => response.json())
        // .then(json => {
        //     if (json && !json.message) {
        //         setData(json);
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
                        label="Category 1"
                        variant="outlined"
                        onChange={(e) => setCat1(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        required 
                        label="Category 2"
                        variant="outlined"
                        onChange={(e) => setCat2(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Button variant="outlined" onClick={handleSubmit}>
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
    );
}

export default Form2;