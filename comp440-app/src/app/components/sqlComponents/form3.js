"use client";

import {Stack, Grid, Button, TextField} from "@mui/material";
import { useEffect, useState } from "react";

const Form3 = () => {
    // const testData = [
    //     {
    //         id: 1,
    //         title: "Title",
    //         desc: "Description",
    //         price: 1999,
    //         categories : ["category1", "category2"],
    //     },
    //     {
    //         id: 2,
    //         title: "Title",
    //         desc: "Description",
    //         price: 2000,
    //         categories : ["category3", "category4"],
    //     },
    //     {
    //         id: 3,
    //         title: "Title",
    //         desc: "Description",
    //         price: 3000,
    //         categories : ["category3", "category4"],
    //     },
    // ]

    const [data, setData] = useState(null); //items
    const [username, setUsername] = useState("");

    const handleSubmit = (username) => {
        const params = new URLSearchParams ({
            username: username
        })

        fetch(`http://localhost:5000/api/three?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(json => {
            setData(json);
        })
        .catch(err => console.log(err));
    }

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" marginBottom={2}
        >
            <Grid container spacing={1} width={275}>
                <Grid item xs={12}>
                    <TextField 
                        required 
                        label="Username"
                        variant="outlined"
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Button variant="outlined" onClick={() => handleSubmit(username)}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
            <ol>
            {data && data.map((item) => (
                <li key={item.id}>
                    <strong>Id:</strong> {" " + item.id} <br />
                    <strong>Title:</strong> {" " + item.title} <br/>
                    <strong>Description:</strong> {" " + item.desc} <br />
                    <strong>Price:</strong> {" $" + item.price/100.00}
                </li>
            ))}
            </ol>
        </Stack>
    )
}

export default Form3;