"use client";

import {Divider, Stack} from "@mui/material"
import { useEffect, useState } from "react";

const List1 = () => {
    const testdata = [
        {
            category: "Laptop",
            items: [
                {
                    id: 1,
                    title: "Test Title",
                    desc: "Test desc",
                    price: 10000,
                },
                {
                    id: 2,
                    title: "something else",
                    desc: "desc",
                    price: 10000,
                }
            ]
        },
        {
            category: "Cellphone",
            items: [
                {
                    id: 3,
                    title: "Test Title 2",
                    desc: "Test desc 3",
                    price: 50000,
                },
            ]
        },
    
    ]
    const [data, setData] = useState(testdata);

    // useEffect(() => {
    //     fetch("http://localhost:5000/api/one", {
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
        <Stack
            spacing={2}
            divider={<Divider flexItem />}
            padding={5}
        >
            {data && data.map((category, index) => (
                <div key={index}>
                    <h4><strong>Category: </strong>{category.category}</h4>
                    <ol>
                        {category.items.map((item) => (
                            <li key={item.id}>
                                <strong>Id:</strong> {" " + item.id} <br />
                                <strong>Title:</strong> {" " + item.title} <br/>
                                <strong>Description:</strong> {" " + item.desc} <br />
                                <strong>Price:</strong> {" $" + item.price/100.00}
                            </li>
                        ))}
                    </ol>

                </div>
            ))}
        </Stack>
    )
}

export default List1;