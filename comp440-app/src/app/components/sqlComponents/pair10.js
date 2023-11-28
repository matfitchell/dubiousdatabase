"use client";

import {Stack, Typography} from "@mui/material";
import { useState, useEffect, useRef } from "react";

const Pair10 = () => {
    const [data, setData] = useState([]);

    const dataFetch = useRef(false);

    useEffect(() => {
        if (dataFetch.current) return;

        fetch("http://localhost:5000/api/ten", {
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
            {data ?
                <div>
                    <Typography variant="h6">{"User pair: (" + data[0] + ", " + data[1] + ")"}</Typography>
                </div> : <></>}

        </Stack>
    )
}

export default Pair10;