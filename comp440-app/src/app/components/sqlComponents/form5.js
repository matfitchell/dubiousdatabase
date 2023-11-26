"use client";

import {Stack, Grid, TextField, Button} from "@mui/material";
import { useState } from "react";

const Form5 = () => {
// Have usernames as dropdown menus
    const [userOptions, setUserOptions] = useState();


    return (
        <Stack direction="column" justifyContent="center" alignItems="center" marginBottom={2}>
            <Grid container spacing={1} width={275}>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Button variant="outlined">
                        Submit
                    </Button>
                </Grid>
            </Grid>
            <ol>
            </ol>
        </Stack>
    )
}

export default Form5;