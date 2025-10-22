import { useState, useEffect, createContext } from "react";

export const LoginContext = createContext();

export function LoginProvider( {children} ){
    const [login, setLogin] = useState(() => {
    try{
        return JSON.parse(localStorage.getItem("login")) || false;
    }catch {
        return false;
    }
    });

    const [name, setName] = useState(()=>{
        return localStorage.getItem("name") || "";
    });

    useEffect(()=>{
    if(name){
        localStorage.setItem("name", name);
    }
    else{
        localStorage.removeItem("name");
    }
    }, [name])

    useEffect(()=>{
    if(login){
        localStorage.setItem("login", JSON.stringify(true));
    }
    // else{
    //     localStorage.removeItem("login");
    // }
    }, [login])

    return(<LoginContext.Provider value={{name, setName, login, setLogin}}>
        {children}
    </LoginContext.Provider>)
}



