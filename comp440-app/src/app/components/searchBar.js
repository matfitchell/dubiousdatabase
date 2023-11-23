import { Stack, Button, InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const SearchBar = ({onSearch}) => {
    const [searchText, setSearchText] = useState("");

    const updateSearch = (e) => {
        setSearchText(e.target.value);
    }

    return (
        <Stack direction={"row"}>
            <OutlinedInput 
                variant="outlined"
                onChange={updateSearch}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>}
                fullWidth />
            <Button variant="outlined" onClick={e => onSearch(searchText)}>Search</Button>
        </Stack>
    )
}

export default SearchBar;