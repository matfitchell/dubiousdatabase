"use client";

import FavoriteItem from "@/app/components/favoriteItem";
import {Stack, Alert, Button, Container, Divider, OutlinedInput} from "@mui/material";
import { useEffect, useState, useRef } from "react";

const FavoriteItems = () => {

    const [favorites, setFavorites] = useState([]);
    const [item, setItem] = useState("");
    const [alertText, setAlertText] = useState(null);

    const dataFetch = useRef(false);

    useEffect(() => {
        if (dataFetch.current) return;
        
        const userObj = {
            username: localStorage.getItem("user")
        };

        fetch("http://localhost:5000/api/item/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        }).then(response => response.json())
        .then(json => {
            if (json && json.message) {
                setAlertText(json.message);
            } else {
                setFavorites(json);
            }
        })
        .catch(err => console.log(err))

        dataFetch.current = true;
    }, []);

    const handleRemove = (id) => {
        // Remove item with id from favorites
        const removeObj = {
            username: localStorage.getItem("user"),
            itemId: id
        }

        fetch("http://localhost:5000/api/item/favorite", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(removeObj)
        }).then(response => {
            if (response.ok) {
                let filtered = favorites.filter((item) => item.id !== id);
                setFavorites(filtered);
            }
            return response.json()
        })
        .then(json => {

        }).catch(err => console.log(err))
    }

    const handleAdd = (id) => {
        const addObj = {
            username: localStorage.getItem("user"),
            itemId: id
        }

        fetch("http://localhost:5000/api/item/favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(addObj)
        }).then(response => {
            if (response.ok) {
                setAlertText(null);
            }
            return response.json();
        })
        .then(json => {
            if (json && json.message) {
                setAlertText(json.message);
            }
            else if (json && json.id) {
                setFavorites([...favorites, json]);
            }
        });
    }


    return (
        <Container maxWidth="md">
            {alertText ? <Alert severity="error" sx={{ marginTop: "20px"}}>{alertText}</Alert> : <></>}
            <Stack direction={"row"} justifyContent={"center"} alignItems={"stretch"} paddingTop={5}>
                <OutlinedInput 
                    required
                    type="number"
                    placeholder="Enter an item id..."
                    onChange={(e) => setItem(e.target.value)} />
                <Button variant="outlined" onClick={() => handleAdd(item)}>
                    Add Item to Favorites
                </Button>
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