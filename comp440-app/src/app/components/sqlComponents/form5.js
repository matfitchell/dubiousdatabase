"use client";

import {Stack, Grid, Button, Select, MenuItem, InputLabel} from "@mui/material";
import { useEffect, useState } from "react";

const Form5 = () => {
    // Have usernames as dropdown menus
    const [data, setData] = useState(); //usernames
    const [userOptions, setUserOptions] = useState();
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/sellers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(json => {
            if (json && !json.message) {
                const usernames = json.map((user) => user.username);
                setUserOptions(usernames);
            }
        })
        .catch(err => console.log(err));
    }, [])

    const handleSubmit = (username1, username2) => {
        if (username1 === username2) {
            return;
        }

        // const params = new URLSearchParams({
        //     user1: username1,
        //     user2: username2
        // })

        // fetch(`http://localhost:5000/api/five?${params}`, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // }).then(response => response.json())
        // .then(json => {
        //     if (json && !json.message) {
        //         setData(json)
        //     }
        // })
        // .catch(err => console.log(err));
    }

    const handleSelect1 = (e) => {
        setUser1(e.target.value);
    }

    const handleSelect2 = (e) => {
        setUser2(e.target.value);
    }

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" marginBottom={2}>
            <Grid container spacing={1} width={275}>
                <Grid item xs={12}>
                    <InputLabel id="username-1">Username 1</InputLabel>
                    <Select labelId="username-1" defaultValue="" onChange={handleSelect1} fullWidth error={user1 === user2}>
                    {userOptions && userOptions.map((user) => 
                        <MenuItem key={user} value={user}>{user}</MenuItem>
                    )}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel id="username-2">Username 2</InputLabel>
                    <Select labelId="username-2" onChange={handleSelect2} error={user1 === user2} defaultValue="" fullWidth>
                    {userOptions && userOptions.map((user, index) => 
                        <MenuItem key={index} value={user}>{user}</MenuItem>
                    )}
                    </Select>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Button variant="outlined" onClick={() => handleSubmit(user1, user2)}>
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

export default Form5;