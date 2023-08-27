import { useContext } from "react";
import Register from "../components/RegisterAndLoginForm";
import Chat from "../components/Chat";

import { UserContext } from "../context/UserContext";

export default function Routes()
{
    const {username,id} = useContext(UserContext);
    if(username)
    {
        return <Chat/>
    }
    return (
        <Register/>
    );
}