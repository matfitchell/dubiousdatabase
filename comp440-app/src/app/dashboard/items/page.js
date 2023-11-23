"use client";

import Item from "@/app/components/item";
import ReviewForm from "@/app/components/reviewForm";
import SearchBar from "@/app/components/searchBar";
import { Container, Divider, Stack} from "@mui/material";
import { useState } from "react";

const Items = () => {
    const [data, setData] = useState([]);
    const [itemToReview, setItemToReview] = useState(null);

    const buyHandler = (id) => {
        const buyItem = {
            username: localStorage.getItem("user"),
            itemId: id
        };

        console.log(buyItem);

        // const options = {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(buyItem)
        // };

        // fetch("http://localhost:5000/api/buyItem", options)
        //     .then(response => response.json())
        //     .then(jsonData => console.log(jsonData))
        //     .catch(err => console.log(err));
    }

    const closeReviewForm = () => {
        setItemToReview(null);
    }

    const onSearch = (searchText) => {
        const params = new URLSearchParams ({
            term: searchText
        })

        fetch(`http://localhost:5000/api/search?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => res.json())
        .then(jsonData => setData(jsonData))
        .catch(err => console.log(err));
    }

    return (
        <Container maxWidth="md">
            <Stack marginTop={"20px"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                <SearchBar onSearch={onSearch}/>
            </Stack>
            {itemToReview ? <ReviewForm itemId={itemToReview.id} itemTitle={itemToReview.title} closeReviewForm={closeReviewForm}/> : <></>}
            <Stack 
                spacing={2}
                divider={<Divider flexItem />}
                justifyContent={"space-between"}
                >
                {data && data.map((item) => (
                    <Item key={item.id} {...item} buyHandler={() => buyHandler(item.id)} reviewHandler={() => setItemToReview(item)} />
                ))}
            </Stack>
        </Container>
    )
}

export default Items;