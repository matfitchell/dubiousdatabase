"use client";

import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Container, Stack, Box, Button } from "@mui/material";

const Nav = () => {
    const router = useRouter();

    // Names of nav links 
    const navs = [
        { name: "Dashboard", path: '/dashboard'},
        { name: "Items", path: '/dashboard/items'},
        { name: "Favorite Items", path: '/dashboard/favoriteItems'},
        { name: "Favorite Sellers", path: '/dashboard/favoriteSellers'},
        { name: "My Items", path: '/dashboard/myitems'},
        { name: "Purchases", path: '/dashboard/purchases'},
        { name: "Logout", path: '/logout'}
    ]

    const handleButtonClick = (path) => {
        if (path == "/logout") {
            localStorage.removeItem("user");
            router.push("/");
        }
        else {
            router.push(path);
        }
    }

    return (
      <AppBar position="static">
        <Container maxWidth="x1">
          <Toolbar disableGutters>
            <Stack justifyContent={"space-between"}>
              <Box sx={{ flexGrow: 1, display: {md: "Flex"}}}>
                {navs.map((nav) => (
                  <Button 
                    key={nav.name}
                    sx={{ my: 2, color: "white", display: "block"}}
                    onClick={() => handleButtonClick(nav.path)}>
                    {nav.name}
                  </Button>
                ))}
              </Box>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    );
}

export default Nav;