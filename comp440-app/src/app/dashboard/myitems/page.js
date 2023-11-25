"use client";

import InsertItemForm from "@/app/components/insertItemForm";
import MyItem from "@/app/components/myItem";
import { Stack, Grid, Button, Divider, Container } from "@mui/material";
import { useState } from "react";

const MyItems = () => {
    let testItems = [
        {
            id: 1,
            title: "Test Item 1",
            desc: "Test item Desc",
            categories: ["Test", "Random"],
            price: 12300
        },
        {
            id: 2,
            title: "Test Item 2",
            desc: "Test item 2 Desc",
            categories: ["Test", "Random", "Item"],
            price: 4400
        },
        {
            id: 3,
            title: "Test Item 3",
            desc: "Test item 3 Desc",
            categories: ["Test", "Item"],
            price: 5500
        },
    ]

    const [myItems, setMyItems] = useState(testItems);
    const [displayForm, setDisplayForm] = useState(false);

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