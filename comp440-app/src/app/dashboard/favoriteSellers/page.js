"use client";

import FavoriteSeller from "@/app/components/favoriteSeller";
import {Stack, Grid, Button, Container, Divider} from "@mui/material";
import { useState } from "react";

const FavoriteSellers = () => {
    let testSellers = [
        {
            username: "Megan"
        },
        {
            username: "Tom"
        },
        {
            username: "Bob"
        },
        {
            username: "Emma"
        }
    ];
    const [favorites, setFavorites] = useState(testSellers);

    const handleRemove = (username) => {
        let filtered = favorites.filter((user) => user.username !== username);
        setFavorites(filtered);
    }

    return (
        <Container maxWidth="md">
            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={5}>
                <Grid container spacing={2} maxWidth={400}>
                    <Grid item xs={12} textAlign={"center"}>
                        <Button variant="outlined">
                            Add Seller to Favorites
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
            {favorites && favorites.map((user) => (
                <FavoriteSeller key={user.username} seller={user.username} removeHandler={() => handleRemove(user.username)}/>
            ))}
            </Stack>
        </Container>
    )
}

export default FavoriteSellers;