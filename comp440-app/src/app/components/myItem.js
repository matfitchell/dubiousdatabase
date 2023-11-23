"use client";

import {Typography, Grid, Chip} from "@mui/material";

const MyItem = ({id, title, categories, desc, price}) => {
    return (
        <Grid container spacing={2} key={id} justifyContent={"space-between"}>
        <Grid xs={3} item>
            <Typography variant="h6">
                {title}
            </Typography>
            <Grid container spacing={0.5}>
                {categories.map((category, index) => 
                    <Grid item key={index}>
                        <Chip label={category} size='small' />
                    </Grid>
                )}
            </Grid>
        </Grid>
        <Grid xs={6} item>
            <Typography variant="subtitle">
                <p>{desc}</p>
            </Typography>
        </Grid>
        <Grid xs={3} item textAlign={'end'}>
            <Typography>{"$" + price/100.00}</Typography>
        </Grid>
    </Grid>
    );
}

export default MyItem;