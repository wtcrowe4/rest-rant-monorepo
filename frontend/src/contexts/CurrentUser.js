import { createContext, useEffect, useState } from "react";


export const CurrentUser = createContext()

function CurrentUserProvider({ children }){

    const [currentUser, setCurrentUser] = useState(null)
    window.setCurrentUser = setCurrentUser
    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const response = await fetch('http://localhost:5000/auth/profile', {
                credentials: 'include'
            })
            const user = await response.json()
            setCurrentUser(user)
        }
        fetchLoggedInUser()
    }, [])
    
    return (
        <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUser.Provider>
    )
}

export default CurrentUserProvider