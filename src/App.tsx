import { Navbar } from "./Components/Navbar"
import { CreatePostPage } from "./Pages/CreatePostPage"
import { Home } from "./Pages/Home"
import { Route, Routes } from "react-router"
import { PostPage } from "./Pages/PostPage"
function App() {
  return (
    <div> 
      <Navbar/>
          <div>
            <Routes>
              <Route path = "/" element = {<Home/>}/>
              <Route path = "/create" element = {<CreatePostPage/>}/>
              <Route path = "/post/:id" element = {<PostPage/>}/>

            </Routes>
          </div>
    
    </div>
  )
}

export default App
