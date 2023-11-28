"use client";

import FavoriteSeller from "@/app/components/favoriteSeller";
import {Stack, Button, Container, Divider, OutlinedInput, Alert} from "@mui/material";
import { useState, useEffect } from "react";

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
    const [username, setUsername] = useState("");
    const [alertText, setAlertText] = useState(null);

    useEffect(() => {
        const userObj = {
            username: localStorage.getItem("user")
        };

        // fetch("http://localhost:5000/api/seller/favorites", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(userObj)
        // }).then(response => response.json())
        // .then(json => {
        //     if (json && json.message) {
        //         setAlertText(json.message);
        //     } else {
        //         setFavorites(json);
        //     }
        // }).catch(err => console.log(err))
    }, []);

    const handleRemove = (username) => {
        const removeObj = {
            username: localStorage.getItem("user"),
            userToDel: username
        }

        // fetch("http://localhost:5000/api/seller/favorite", {
        //     method: "DELETE",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(removeObj)
        // }).then(response => {
        //     if (response.ok) {
        //         let filtered = favorites.filter((user) => user.username !== username);
        //         setFavorites(filtered);
        //     }
        // })
        // .then(json => {
        //     console.log(json)
        // })
        // .catch(err => console.log(err));
    }

    const handleAdd = (user) => {
        const addObj = {
            username: localStorage.getItem("user"),
            userToFav: user
        }

        // fetch("http://localhost:5000/api/seller/favorite", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(addObj)
        // }).then(response => {
        //     if (response.ok) {
        //         setAlertText(null);
        //         setFavorites([...favorites, { username: user }])
        //     }
        //     return response.json();
        // })
        // .then(json => {
        //     if (json && json.message) {
        //         setAlertText(json.message);
        //     }
        // }).catch(err => console.log(err))
    }

    return (
        <Container maxWidth="md">
            {alertText ? <Alert severity="error" sx={{ marginTop: "20px"}}>{alertText}</Alert> : <></>}
            <Stack direction={"row"} justifyContent={"center"} alignItems={"stretch"} paddingTop={5}>
                <OutlinedInput 
                    required 
                    type="text"
                    placeholder="Enter a username..."
                    onChange={(e) => setUsername(e.target.value)} />
                <Button variant="outlined" onClick={() => handleAdd(username)}>
                    Add Seller to Favorites
                </Button>
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