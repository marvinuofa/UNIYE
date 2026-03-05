import { useParams } from "react-router"
import { PostDetail } from "../Components/PostDetail"

export const PostPage = () => {
    const { id } = useParams<{id :string}>();
    return (
        <div> 
            <PostDetail postId = {Number(id)}/>
        </div>
    )
}