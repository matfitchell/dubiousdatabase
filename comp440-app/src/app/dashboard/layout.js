"use client";

import Nav from "./nav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const [userExists, setUserExists] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
    
        if (!user) {
          router.push("/");
          setUserExists(false);
        } else {
            setUserExists(true);
        }

    }, []);
    
    if (!userExists) return null;

    return (
        <section>
            <Nav/>
            <main>
                {children}
            </main>
        </section>
    )
}

export default DashboardLayout;