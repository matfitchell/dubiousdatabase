"use client";

import { Stack, Grid, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";

const InsertItemForm = ({insertedItem, closeInsertForm}) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [categories, setCategories] = useState("");
    const [price, setPrice] = useState("");
    const [alertText, setAlertText] = useState(null);

    const handleInsert = (item) => {
        // fetch("http://localhost:5000/api/insertItem", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json"
        //   },
        //   body: JSON.stringify(item)
        // }).then(response => {
        //     return response.json();
        // })
        // .then(data => {
        //     // Get newly inserted item with id from db
        //     if (data && data.id) {
        //         const newItem = {
        //             id: data.id,
        //             title: data.title,
        //             desc: data.desc,
        //             categories: data.categories,
        //             price: data.price
        //         }

        //         setAlertText(null);

        //         insertedItem(newItem);
        //         closeInsertForm;
        //     } else if (data && data.message) {
        //         setAlertText("Error: ", data.message);
        //     }
        // })
        // .catch(err => console.log(err));

        insertedItem({
            title: item.itemTitle,
            desc: item.itemDesc,
            categories: item.itemCategory,
            price: item.itemPrice,
            id: Math.random() * 1000 + 1
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let categoryArr = [];
        categories.split(",").forEach(c => {
            c = c.trim();
            categoryArr.push(c);
        });
   
        let priceInt = parseInt(parseFloat(price) * 100);

        let item = {
            username: localStorage.getItem("user"),
            itemTitle: title,
            itemDesc: desc,
            itemCategory: categoryArr,
            itemPrice: priceInt,
        }

        handleInsert(item);
    }

    return(
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={10}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} maxWidth={400}>
                {alertText ? <Grid item xs={12}><Alert severity="error">{alertText}</Alert></Grid> : <></>}
                    <Grid item xs={12}>
                        <TextField 
                            required 
                            label="Title"
                            type="text"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setTitle(e.target.value)}
                         />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            required 
                            label="Description"
                            type="text"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setDesc(e.target.value)}
                         />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            required 
                            label="Categories (x, y, z, ...)"
                            type="text"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setCategories(e.target.value)}
                         />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            required 
                            label="Price"
                            type="text"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setPrice(e.target.value)}
                         />
                    </Grid>
                    <Grid item xs={12} textAlign={"center"}>
                        <Button type="submit" variant="outlined">Insert</Button>
                        <Button 
                            variant="outlined" 
                            color="error"
                            onClick={closeInsertForm}
                            sx={{ marginLeft: "5px"}}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Stack>
    );
}

export default InsertItemForm;