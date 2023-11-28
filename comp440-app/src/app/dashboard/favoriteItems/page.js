"use client";

import FavoriteItem from "@/app/components/favoriteItem";
import {Stack, Alert, Button, Container, Divider, OutlinedInput} from "@mui/material";
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
    const [item, setItem] = useState("");
    const [alertText, setAlertText] = useState(null);

    useEffect(() => {
        const userObj = {
            username: localStorage.getItem("user")
        };

        // fetch("http://localhost:5000/api/item/favorites", {
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
        // })
    }, []);

    const handleRemove = (id) => {
        // Remove item with id from favorites
        const removeObj = {
            username: localStorage.getItem("user"),
            id: id
        }

        // fetch("http://localhost:5000/api/item/favorite", {
        //     method: "DELETE",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(removeObj)
        // }).then(response => {
        //     if (response.ok) {
        //         let filtered = favorites.filter((item) => item.id !== id);
        //         setFavorites(filtered);
        //     }
        //     return response.json()
        // })
        // .then(json => {

        // }).catch(err => console.log(err))
    }

    const handleAdd = (id) => {
        const addObj = {
            username: localStorage.getItem("user"),
            itemId: id
        }

        // fetch("http://localhost:5000/api/item/favorite", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(addObj)
        // }).then(response => {
        //     if (response.ok) {
        //         setAlertText(null);
        //     }
        //     return response.json();
        // })
        // .then(json => {
        //     if (json && json.message) {
        //         setAlertText(json.message);
        //     }
        //     else if (json && json.id) {
        //         setFavorites([...favorites, json]);
        //     }
        // });
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