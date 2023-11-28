"use client";

import {Stack} from "@mui/material";
import { useState, useEffect, useRef } from "react";

const List9 = () => {
    // const testData = ["Alice", "John", "Emma"];
    const [data, setData] = useState([]);

    const dataFetch = useRef(false);

    useEffect(() => {
        if (dataFetch.current) return;

        fetch("http://localhost:5000/api/nine", {
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

        dataFetch.current = true;
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

export default List9;