import { Link } from "react-router"
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const {signInWithGoogle, signOut, user } = useAuth()

    const displayName = user?.user_metadata. user_name || user?.email
   return (
   <nav> 
        <div> 
            <div>
                <Link to = {"/"}>
                    <span>U</span>niye
                </Link>
                {/* Desktop Links */}
                <div>
                    <Link to =  {"/"}> Home</Link>
                    <Link to =  {"/create"}> Create Post </Link>
                    <Link to =  {"/communites "}> Communities </Link>
                    <Link to =  {"/communnity/create"}> Create Community</Link>
                </div>

                {/* Desktop Aut*/}
                <div>
                        {/* Switch to google later / U of a  */}

                        {user ? (
                                <div>
                                    {user.user_metadata.avatar_url && (
                                        <img src = {user.user_metadata.avatar_url} alt = "UserAvatar "/>
                                    ) }
                                    <span>{displayName}</span>
                                    <button onClick={signOut}>Sign Out</button>
                                </div>
                                ) : (
                                <button onClick={signInWithGoogle}>Sign In</button>
                        )}
                </div>

                {/* Mobile Menu  Button*/}

                <div> 
                    {" "}
                    <button onClick = {() => setMenuOpen(!menuOpen)}> Open(make hamburger menu)</button>

                </div>


                {/* Mobile Menu */}
                {menuOpen && (
                <div>
                    <div>
                        <Link to =  {"/"}> Home</Link>
                        <Link to =  {"/create"}> Create Post </Link>
                        <Link to =  {"/communites "}> Communities </Link>
                        <Link to =  {"/communnity/create"}> Create Community</Link>
        
                    </div>
                </div>
                )}
            </div>
        </div>
    </nav>
   )
}