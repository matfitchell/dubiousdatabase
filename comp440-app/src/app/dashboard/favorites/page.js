"use client";

import {Stack, Grid, Button} from "@mui/material";

const Favorites = () => {


    return (
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} paddingTop={5}>
            <Grid container spacing={2} maxWidth={400}>
                <Grid item xs={6}>
                    <Button variant="outlined">Favorite Items</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined">Favorite Sellers</Button>
                </Grid>
            </Grid>
        </Stack>    
    )
}

export default Favorites;