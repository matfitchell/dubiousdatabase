"use client";

import {Stack} from "@mui/material";
import { useState, useEffect } from "react";

const List7 = () => {
    // const testData = ["Alice", "John", "Emma"];
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/seven", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(json => {
            if (json && !json.message) {
                setData(json)
            }
        })
        .catch(err => console.log(err));
    }, [])

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" marginBottom={2}>
            <ol>
            {data && data.map((user, index) => 
                <li key={index}>
                    <strong>Username:</strong> {" " + user}
                </li>
            )}
            </ol>
        </Stack>
    )
}

export default List7;