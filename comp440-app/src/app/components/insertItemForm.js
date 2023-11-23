"use client";

import { Stack, Grid, TextField, Button } from "@mui/material";
import { useState } from "react";

const InsertItemForm = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [categories, setCategories] = useState("");
    const [price, setPrice] = useState("");

    const handleInsert = (item) => {
        fetch("http://localhost:5000/api/insertItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(item)
        }).then(response => {
            return response.json();
        })
        .then(json => {
            console.log(json);
        })
        .catch(err => console.log(err));
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
                    </Grid>
                </Grid>
            </form>
        </Stack>
    );
}

export default InsertItemForm;