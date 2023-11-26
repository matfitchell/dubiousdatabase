"use client";

import Purchase from "@/app/components/purchase";
import {Container, Stack, Divider} from "@mui/material";
import { useEffect, useState } from "react";

const Purchases = () => {
    const [purchases, setPurchases] =useState(null);

    useEffect(() => {
        const params = new URLSearchParams ({
            username: localStorage.getItem("user"),
        })

        fetch(`http://localhost:5000/api/purchases?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(json => {
            if (json && !json.message) {
                setPurchases(json);
            }
        })
        .catch(err => console.log(err));
    }, [])

    return (
        <Container maxWidth="md">
            <Stack
            spacing={2}
            divider={<Divider flexItem />}
            justifyContent={"space-between"}
            paddingTop={5}
            >
            {purchases && purchases.map((item) => (
                <Purchase key={item.id} {...item} />
            ))}
            </Stack>
        </Container>
    )
}

export default Purchases;