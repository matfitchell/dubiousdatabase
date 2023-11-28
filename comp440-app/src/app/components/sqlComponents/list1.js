"use client";

import { Stack} from "@mui/material"
import { useEffect, useState } from "react";

const List1 = () => {
    // const testdata = [
    //     {

    //         id: 2,
    //         title: "something else",
    //         desc: "desc",
    //         category: "Laptop",
    //         price: 10000,
    //     },
    //     {

    //         id: 3,
    //         title: "Test Title 2",
    //         desc: "Test desc 3",
    //         category: "Cellphone",
    //         price: 50000,

    //     },
    
    // ]
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/one", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(json => {
            setData(json);
        })
        .catch(err => console.log(err));
    }, [])

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" marginBottom={2}
        >
            <ol>
                {data && data.map((item, index) => (
                    <li key={index}>
                        <strong>Id:</strong> {" " + item.id} <br />
                        <strong>Category:</strong> {" " + item.category} <br/>
                        <strong>Title:</strong> {" " + item.title} <br/>
                        <strong>Price:</strong> {" $" + item.price/100.00}
                    </li>
                ))}
            </ol>
        </Stack>
    )
}

export default List1;