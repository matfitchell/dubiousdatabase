"use client";

import Purchase from "@/app/components/purchase";
import {Container, Stack, Divider} from "@mui/material";
import { useState } from "react";

const Purchases = () => {
    let testPurchases = [
        {
            id: 1,
            title: "Phone case",
            desc: "Great phone case.",
            categories: ["Cellphone", "iPhone"],
            seller: "Emma",
            price: 2300
        },
        {
            id: 2,
            title: "iPhone 13",
            desc: "Description here.",
            categories: ["Apple", "iPhone", "Cellphone"],
            seller: "Emma",
            price: 2300
        },
        {
            id: 3,
            title: "Designer Bag",
            desc: "Great quality and never been used.",
            categories: ["Bag"],
            seller: "Alice",
            price: 12000
        }
    ]
    const [purchases, setPurchases] =useState(testPurchases);

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