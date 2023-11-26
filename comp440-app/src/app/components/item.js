import {Button, Chip, Grid, Stack, Typography} from '@mui/material';

const Item = ({ id, title, categories, desc, price, seller, isBought, buyHandler, reviewHandler }) => {
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
            <Stack direction={"row"} 
                justifyContent={'flex-end'} 
                alignItems={'center'}
                spacing={0.5}>                
                <Typography variant='body2'>Sold by:</Typography>
                <Typography variant='body1'>{seller}</Typography>
            </Stack>
            <Typography>{"$" + price/100.00}</Typography>
            <Stack direction={"row"} 
                justifyContent={'flex-end'} 
                alignItems={'center'}
                spacing={0}>
                <Button variant='outlined'
                    onClick={buyHandler}
                    sx={{borderRadius:5, 
                        borderEndEndRadius:0, 
                        borderStartEndRadius:0}}
                    disabled={isBought}>
                    {isBought ? "Sold" : "Buy"}
                </Button>
                <Button variant='outlined'
                    onClick={reviewHandler}
                    sx={{borderRadius:5, 
                        borderEndStartRadius:0, 
                        borderStartStartRadius:0}}>
                    Review
                </Button>
            </Stack>
        </Grid>
    </Grid>
  );
};

export default Item;
