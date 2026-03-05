import { Link } from "react-router"
import type { Post } from "./PostList"

interface Props{
    post: Post

}

export const PostItem = ({ post } : Props) => {
    return (
        <div>
            <div>
                <Link to = {`/post/${post.id}`}>
                    <div>
                            <div>
                                {/* Header: Avatar and Title */}
                                {/*null will be s div with css tailwind*/}
                                {post.avatar_url ?  (<img src ={post.avatar_url} alt = "User Avatar"/> ) :null} 
                                <div>
                                    <div>{post.title}
                                    </div>
                                </div>
                            </div>

                            {/* Image Banner */}
                            <div>
                                <img src = {post.image_url} alt = {post.title}/>
                            </div>
                            
                            <div>
                                <span>
                                    {" "} likes
                                    <span> {post.like_count ?? 0 } </span>{" "}
                                </span>
                                <span>
                                    {" "}
                                    comments
                                    <span> {post.comment_count ?? 0 }</span>
                                </span>
                            </div>
                        </div>
                </Link>
            </div>
        </div>
    
    
)}
