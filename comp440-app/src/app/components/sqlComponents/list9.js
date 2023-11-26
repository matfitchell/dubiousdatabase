"use client";

import {Stack} from "@mui/material";
import { useState } from "react";

const List9 = () => {
    const testData = [
        {
            username: "Alice"
        },
        {
            username: "John"
        },
        {
            username: "Emma"
        },
        {
            username: "Emma"
        }
    ]
    const [data, setData] = useState(testData);

    // useEffect(() => {
    //     fetch("http://localhost:5000/api/nine", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }).then(response => response.json())
    //     .then(json => {
    //         if (json && !json.message) {
    //             setData(json)
    //         }
    //     })
    //     .catch(err => console.log(err));
    // }, [])

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" marginBottom={2}>
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

export default List9;