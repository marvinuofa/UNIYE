import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";


interface Props{
    postId:number;
}
interface NewComment{
    content: string;
    parent_comment_id?: number | null;
}
export interface Comment{
    id: number, 
    post_id: number 
    parent_comment_id: number | null; 
    content: string;
    user_id: string; 
    created_at: string;
    author: string; 
}

const createComment = async (
    newComment:NewComment,
    postId: number, 
    userId?: string,
    author?: string) => {
        if ( !userId || !author ){
            throw new Error("You must be logged in to comment")
        }

        const {error} = await supabase.from('comments').insert({
            post_id: postId,
            content: newComment.content, 
            parent_comment_id: newComment.parent_comment_id ||null,
            user_id: userId, 
            author: author, 
        })
        if (error) throw Error(error.message)

    };

const fetchComments =async (postId:number): Promise<Comment[]> => {
    const {data, error} = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", {ascending: true}); 

    if(error) throw new Error(error.message);
    return data as Comment[]; 
    
}


export const CommentSection = ({postId}: Props) =>{
    const [newCommentText, setNewCommentText] = useState<string>("")
    const {user} = useAuth()
    const queryClient = useQueryClient();
    const { data: comments, isLoading, error} = useQuery<Comment[], Error>({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
        refetchInterval: 5000, 
    })

    

    const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
        createComment(newComment, postId, user?.id, user?.user_metadata?.full_name),

    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    });

    const handleSubmit = (e:React.FormEvent) =>{
        e.preventDefault()

        if(!newCommentText) return;
        
        mutate({content: newCommentText, parent_comment_id: null}) 
        setNewCommentText("");

    }

    /* Map of Comments - Organize replies - Return Tree */
    const buildCommentTree = (flatComments: Comment[]): (Comment & { children?:Comment[] })[] => {
        const map = new Map<number, Comment & { children?:Comment[] }>();
        const roots: (Comment & { children ?:  Comment[]})[] = [];

        flatComments.forEach((comment) => {
            map.set(comment.id, {...comment, children:[]});
        }); 

        flatComments.forEach((comment) =>{
            if(comment.parent_comment_id){
                const parent = map.get(comment.parent_comment_id)
                if(parent){
                    parent.children!.push(map.get(comment.id)!);
                }
            }else{
                roots.push(map.get(comment.id)!)
            }
        });

        return roots; 

    }



    if (isLoading) {
        return <div>Loading Comments ...</div>;
    }
    
    if (error) {
        return <div>Error: {error.message}</div>;
    } 

    const commentTree = comments ? buildCommentTree(comments) : []

    return(
        <div>
            <h3> Comments </h3>
            {/* Create comment section*/}

            {user ? (
                <form onSubmit = {handleSubmit}>
                <textarea
                        value = {newCommentText}
                        rows ={3} 
                        placeholder = "Write a comment..."
                        onChange={(e) => setNewCommentText(e.target.value)}/>
                <button type = "submit" disabled = {!newCommentText}>
                    {
                        isPending ? "Posting.." : "Post comment"

                    } </button>
                    {isError  && <p>Error Posting Comment</p>}
            </form>) : (<p> You must be logged in to post a comment </p> 
            )}
            {/* Comment Display Section*/}
            <div>
                {commentTree.map((comment, key) => (
                    <CommentItem key = {key} comment = {comment} postId = {postId}/>
                ))}
            </div>
        </div>
    )
}