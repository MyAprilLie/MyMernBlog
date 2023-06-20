import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "@mui/material/Container";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, TagPosts } from "./pages";
import React from "react";
import { fetchAuthMe, selectIsAuth } from "./Redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/posts/:id" element={<FullPost />}></Route>
          <Route path="/posts/:id/edit" element={<AddPost />}></Route>
          <Route path="/add-post" element={<AddPost />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Registration />}></Route>
          <Route path="/posts/tags/:tag" element={<TagPosts />} />

        </Routes>
      </Container>
    </>
  );
}

export default App;
