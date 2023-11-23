"use client";

import InsertItemForm from "@/app/components/insertItemForm";
import { Stack, Grid, Button } from "@mui/material";
import { useState } from "react";

const MyItems = () => {
    const [myItems, setMyItems] = useState();
    const [displayForm, setDisplayForm] = useState();

    const toggleInsertForm = () => {
        displayForm ? setDisplayForm(false) : setDisplayForm(true);
    }

    const getMyItems = () => {
        // Fetch my items
        console.log("View My Items clicked.");
    }

    return (
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={10}>
            <Grid container spacing={2} maxWidth={400}>
                <Grid item xs={6}>
                    <Button variant="outlined" onClick={toggleInsertForm}>Insert Item</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" onClick={getMyItems}>View My Items</Button>
                </Grid>
            </Grid>
            <InsertItemForm />
        </Stack>
    )
}

export default MyItems;