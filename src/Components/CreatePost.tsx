import { useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../Contexts/AuthContext";

interface PostInput{
    title: string;
    content:string;
    avatar_url: string|null
}

const createPost = async (post: PostInput, imageFile: File)=> {

    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`

    console.log(filePath)

   // const {error: uploadError} = await supabase.storage.from("post-images").upload(filePath, imageFile)
   const { data: uploadData, error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile, { upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage.from("post-images").getPublicUrl(filePath)
    const { data, error } = await supabase.from("posts").insert({...post, image_url: publicURLData.publicUrl,});

    if (error) throw new Error(error.message);

    return data;

}

export const CreatePost = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    

    const { user } = useAuth();


    const {mutate, isPending, isError } = useMutation({mutationFn: (data: {post: PostInput, imageFile: File}) => {
        return  createPost(data.post, data.imageFile)}}) // useMutation returns a mutate function 
 
    const handleSubmit = (event: React.FormEvent) =>{
        event.preventDefault()
        if (!selectedFile) return 
        mutate({post: {title, content, avatar_url: user?.user_metadata.avatar_url || null }, imageFile : selectedFile})

    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            setSelectedFile(e.target.files[0]); 
        }
    }

    return(
    <form onSubmit ={handleSubmit}> 
        {""}
        <div>
            {" "}
            <label> Title</label>
            <input 
                type = "text" 
                id = "title" 
                required 
                onChange={(event) => setTitle(event.target.value)}
            /> 
        </div>
        <div>
            {" "}
            <label> Content </label>
            <textarea  
                id= "content" 
                required 
                rows = {5} 
                onChange={(event) => setContent(event.target.value)}
            /> 
        </div>
        <div>
            {" "}
            <label> Upload Image </label>
            <input
                type ="file"
                id= "cimage" 
                required 
                accept="image/*"
                onChange={handleFileChange}/>
        </div>
        <button type = "submit" > {isPending?  "Creating ": "Create Post"} </button>
        {isError && <p> Error creating post</p>}
    </form>
    )
}