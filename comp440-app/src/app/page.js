"use client";

import LoginForm from "./components/loginForm";
import { useRouter } from "next/navigation";

const Home = () => {
  // const [user, setUser] = useState("");
  const router = useRouter();

  const loginHandler = (data) => {
    localStorage.setItem("user", data.user);
    router.push("/dashboard");
  }
  // const logoutHandler = () => setUser("");

  return (
    <main>
      <LoginForm onLogin={loginHandler}/>
    </main>
  );
}

export default Home;