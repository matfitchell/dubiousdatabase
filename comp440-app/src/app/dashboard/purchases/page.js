"use client";

import Purchase from "@/app/components/purchase";
import {Container, Stack, Divider, Typography} from "@mui/material";
import { useEffect, useState, useRef } from "react";

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);

    const dataFetch = useRef(false);

    useEffect(() => {
        if (dataFetch.current) return;

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
        
        dataFetch.current = true;
    }, [])

    return (
        <Container maxWidth="md">
            <Stack
            spacing={2}
            divider={<Divider flexItem />}
            justifyContent={"space-between"}
            paddingTop={5}
            >
            {!purchases.length == 0 ? purchases.map((item) => (
                <Purchase key={item.id} {...item} />
            )) : <Typography variant="h6" textAlign={"center"}>No items have been purchased yet.</Typography>}
            </Stack>
        </Container>
    )
}

export default Purchases;