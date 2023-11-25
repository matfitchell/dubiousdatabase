"use client";

import { Grid, Chip, Typography, Stack } from "@mui/material";

const Purchase = ({id, title, categories, desc, seller, price}) => {
    return (
        <Grid container spacing={2} key={id} justifyContent={"space-between"}>
            <Grid xs={3} item>
                <Typography variant="h6">{title}</Typography>
                <Grid container spacing={0.5}>
                {categories.map((category, index) => (
                    <Grid item key={index}>
                    <Chip label={category} size="small" />
                    </Grid>
                ))}
                </Grid>
            </Grid>
            <Grid xs={6} item>
                <Typography variant="subtitle">
                <p>{desc}</p>
                </Typography>
            </Grid>
            <Grid xs={3} item textAlign={"end"}>
                <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                spacing={0.5}
                >
                    <Typography variant="body2">Sold by:</Typography>
                    <Typography variant="body1">{seller}</Typography>
                    </Stack>
                    <Typography>{"$" + price / 100.0}</Typography>
            </Grid>
        </Grid>
    )
}

export default Purchase;