"use client";

import InsertItemForm from "@/app/components/insertItemForm";
import MyItem from "@/app/components/myItem";
import { Stack, Grid, Button, Divider, Container } from "@mui/material";
import { useEffect, useState } from "react";

const MyItems = () => {
    const [myItems, setMyItems] = useState(null);
    const [displayForm, setDisplayForm] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams ({
            username: localStorage.getItem("user")
        });

        fetch(`http://localhost:5000/api/items?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(json => {
            if (json && !json.error) {
                setMyItems(json);
            }
        })
        .catch(err => console.log(err));
    }, [])

    const toggleInsertForm = () => {
        displayForm ? setDisplayForm(false) : setDisplayForm(true);
    }

    // Update list with newly inserted item
    const updateMyItems = (item) => {
        // let newList = myItems.push(item);
        setMyItems([...myItems, item]);
    }

    return (
        <Container maxWidth="md">
            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={5}>
                <Grid container spacing={2} maxWidth={400}>
                    <Grid item xs={12} textAlign={"center"}>
                        <Button variant="outlined" onClick={toggleInsertForm}>Insert New Item</Button>
                    </Grid>
                    {displayForm ? <InsertItemForm insertedItem={updateMyItems} closeInsertForm={toggleInsertForm}/> : <></>}
                </Grid>
            </Stack>
            <Stack
                spacing={2}
                divider={<Divider flexItem />}
                justifyContent={"space-between"}
                paddingTop={5}
            >
                {myItems && myItems.map((item) => (
                    <MyItem key={item.id} {...item} />
                ))}
            </Stack>
        </Container>
    )
}

export default MyItems;