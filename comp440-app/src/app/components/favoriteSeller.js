"use state";

import {Grid, Button, Typography, Stack} from "@mui/material";

const FavoriteSeller = ({seller, removeHandler}) => {
    return (
        <Grid container spacing={2} justifyContent={"space-between"}>
            <Grid item xs={6}>
                <Typography variant="h6">{seller}</Typography>
            </Grid>
            <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                alignItems={"center"}
            >
                <Button variant="outlined" onClick={removeHandler}>
                    Remove
                </Button>
            </Stack>
        </Grid>
    )
}

export default FavoriteSeller;