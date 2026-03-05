import { SupabaseClient, type User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { data } from "react-router";


// when we want to acces info about the user we call auth context 
interface AuthContextType{
    user: User | null  // set to null if user is not logged in
    signInWithGoogle: () => void ;
    signOut: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ( { children }: {children: React.ReactNode}) => { // children: React.ReactNode (Anything react can render)

    const [user, setUser ] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data:{session}}) =>{
            setUser(session?.user ?? null) // if session then add .user to seeion else null?
        })

        // set user to null on signout 
        const {data: listener} = supabase.auth.onAuthStateChange((_,session) => { //listener for state change
            setUser(session?.user ?? null)

        })
 
        return () =>{
            listener.subscription.unsubscribe(); //prevent memory leaks
        }
    }, []) // The empty dependency array [] means: Run this only once when the component mounts. So this runs when the app first loads.



    const signInWithGoogle = () =>{
        supabase.auth.signInWithOAuth({ provider: "google" })

    }
    const signOut = () => {
        supabase.auth.signOut()
    }
    return <AuthContext.Provider value = {{user, signInWithGoogle, signOut}}> {" "} {children} {" "}</AuthContext.Provider>

}

export const useAuth= (): AuthContextType =>{ // : The colon : is a type annotation.“This function returns something of type AuthContextType.”
    const context = useContext(AuthContext) 
    if (context === undefined){
        throw new Error("useAuth must be used within the AuthProvider")
    }
    return context 
}