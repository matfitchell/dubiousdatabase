"use client";

import FavoriteItem from "@/app/components/favoriteItem";
import {Stack, Grid, Button, Container, Divider, Chip, } from "@mui/material";
import { useEffect, useState } from "react";

const FavoriteItems = () => {
    let testFavs = [
        {
            id: 1,
            title: "Test Item 1",
            desc: "Test item Desc",
            categories: ["Test", "Random"],
            seller: "Megan",
            price: 12300
        },
        {
            id: 2,
            title: "Test Item 2",
            desc: "Test item 2 Desc",
            categories: ["Test", "Random", "Item"],
            seller: "Tom",
            price: 4400
        },
        {
            id: 3,
            title: "Test Item 3",
            desc: "Test item 3 Desc",
            categories: ["Test", "Item"],
            seller: "Emma",
            price: 5500
        },
    ];

    const [favorites, setFavorites] = useState(testFavs);

    const handleRemove = (id) => {
        // Remove item with id from favorites
        let filtered = favorites.filter((item) => item.id !== id);
        setFavorites(filtered);
    }


    return (
        <Container maxWidth="md">
            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={5}>
                <Grid container spacing={2} maxWidth={400}>
                    <Grid item xs={12} textAlign={"center"}>
                        <Button variant="outlined">
                            Add Item to Favorites
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
            <Stack
            spacing={2}
            divider={<Divider flexItem />}
            justifyContent={"space-between"}
            paddingTop={5}
            >
            {favorites && favorites.map((item) => (
                <FavoriteItem key={item.id} {...item} removeHandler={() => handleRemove(item.id)}/>
            ))}
            </Stack>
        </Container>
    )
}

export default FavoriteItems;