import { useState } from "react";
import type { Comment } from "./CommentSection"
import { useAuth } from "../Contexts/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props{
    comment: Comment & {
        children?: Comment[];
    };
    postId: number; 

}

const createReply = async (replyContent: string, postId: number, parentCommentId: number, userId?:string, author?: string) => {
    if (!userId || !author ){
        throw new Error("You must be logged in to reply")
    }

    const {error} = await supabase.from('comments').insert({
        post_id: postId,
        content: replyContent, 
        parent_comment_id: parentCommentId,
        user_id: userId, 
        author: author, 
    })
    if (error) throw Error(error.message)

}
    

export const CommentItem = ({comment, postId}: Props) => {
    const [showReply, setShowReply]  = useState<boolean>(false)
    const [replyText, setReplyText]  = useState<string>("")
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { user } = useAuth();
    const queryClient = useQueryClient();


    const handleReplySubmit = (e:React.FormEvent) =>{
        e.preventDefault()
        if(!replyText) return;
        mutate(replyText) 
        setReplyText("");
        setShowReply(false)

    }
    const { mutate, isPending, isError } = useMutation({
        mutationFn: (replyContent: string) =>
            createReply(replyContent, postId, comment.id, user?.id, user?.user_metadata?.full_name),
    
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        });
    
    return(
        <div>
            <div> 
                <div style={{ border: "1px solid red" }}>
                    {/* Display the commenters uasename */}
                    <span>{comment.author}</span>
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p>{comment.content}</p>
                <button onClick = {() => setShowReply((prev) => !prev)}> 
                    {showReply? "Cancel" : "Reply"} 
                </button>
            </div>
            {showReply && user && (
                 <form onSubmit = {handleReplySubmit}>
                 <textarea
                         value = {replyText}
                         rows ={2} 
                         placeholder = "Write a reply..."
                         onChange={(e) => setReplyText(e.target.value)}/>
                 <button type = "submit">
                     {
                         isPending ? "Posting.." : "Post reply"
 
                     } </button>
                     {isError  && <p>Error Posting reply</p>}
             </form>
            )}
            {comment.children && comment.children.length > 0 && (
                <div> 
                    <button onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? "Hide Replies (change to arrow down svg)": "Show Replies (change to arrow down svg)"}
                    </button>
                    {isCollapsed && (
                    <div>
                         {comment.children.map((child, key) => (
                            <CommentItem key ={key} comment = {child} postId = {postId} />
                        ))}
                    </div>
                    )}
                </div> 
            )}
        </div> 
    );
}