import { useQuery } from  '@tanstack/react-query'
import { supabase } from '../supabase-client';
import { PostItem } from './PostItem';

export interface Post{
    id: number;
    title: string;
    content: string;
    created_at: string;
    image_url: string;
    avatar_url?: string; 
    like_count?: number;
    comment_count?: number;
}

const fetchPosts = async () : Promise<Post[]> =>{
       const {data, error} = await supabase.rpc("get_posts_with_counts")

       if (error) throw new Error(error.message);

       console.log(data)

       return data as Post[];
}

export const PostList = () =>{
   
    const {data, error, isLoading} = useQuery<Post[], Error>({queryKey: ["posts"], queryFn: fetchPosts,});

    if (isLoading) <div> Loading posts...</div>
    if (error){
        return <div> Error: {error.message} </div>
    }

    return(
        <div>
            {data?.map((post, key) => (<PostItem post = {post} key = {key}/>))}
        </div>
    )
}
