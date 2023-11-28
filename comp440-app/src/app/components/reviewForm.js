"use client";

import { Stack, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useState } from "react";

const ReviewForm = ({itemId, itemTitle, closeReviewForm}) => {
    const [rating, setRating] = useState();
    const [desc, setDesc] = useState();

    const handleReview = (reviewObj) => {
        fetch("http://localhost:5000/api/reviewItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(reviewObj)
        }).then(response => {
            if (response.ok) {
                closeReviewForm;
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
        })
        .catch(err => console.log(err));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const reviewObj = {
            username: localStorage.getItem("user"),
            itemId: itemId,
            rating: rating,
            desc: desc
        }

        handleReview(reviewObj);
    }

    return (
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={5}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} maxWidth={400}>
                    <Grid item xs={12}>
                        <TextField 
                            disabled
                            value={itemTitle}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="selectLabel">Rating</InputLabel>
                            <Select 
                                labelId="selectLabel"
                                label="Rating"
                                defaultValue=""
                                onChange={(e) => setRating(e.target.value)} 
                            >
                                <MenuItem value="excellent">Excellent</MenuItem>
                                <MenuItem value="good">Good</MenuItem>
                                <MenuItem value="fair">Fair</MenuItem>
                                <MenuItem value="poor">Poor</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Review Description"
                            multiline
                            onChange={(e) => setDesc(e.target.value)}
                            rows={4}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} textAlign={"center"}>
                        <Button type="submit" variant="outlined">
                            Submit Review
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="error"
                            onClick={closeReviewForm}
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

export default ReviewForm;