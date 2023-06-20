import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags, fetchPostsByTag } from "../Redux/slices/posts";
import { fetchComments } from "../Redux/slices/comment";

export const Home = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState(0);

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const comments = useSelector((state) => state.comments.byPostId);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";


  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  const handleTagClick = (tag) => {
    dispatch(fetchPostsByTag(tag)).then(() => {
      navigate(`/posts/tags/${tag}`);
    });
  };

  React.useEffect(() => {
    if (posts.status === "loaded") {
      posts.items.forEach((post) => {
        dispatch(fetchComments(post._id));
      });
    }
  }, [dispatch, posts]);
  
  const allComments = Object.values(comments).flat();


  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {isPostsLoading
            ? [...Array(5)].map((_, index) => (
                <Post key={index} isLoading={true} />
              ))
            : activeTab === 0
            ? posts.items.map((obj) => {
                const postComments = comments[obj._id] || [];
                return (
                  <Post
                    key={obj._id}
                    _id={obj._id}
                    title={obj.title}
                    imageUrl={
                      obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                    }
                    user={obj.user}
                    createdAt={obj.createdAt}
                    viewsCount={obj.viewsCount}
                    commentsCount={postComments.length} 
                    tags={obj.tags}
                    isEditable={userData?._id === obj.user._id}
                    onTagClick={handleTagClick}
                  />
                );
              })
            : posts.items
                .slice()
                .sort((a, b) => b.viewsCount - a.viewsCount)
                .map((obj) => {
                  const postComments = comments[obj._id] || [];
                  return (
                    <Post
                      key={obj._id}
                      _id={obj._id}
                      title={obj.title}
                      imageUrl={
                        obj.imageUrl
                          ? `http://localhost:4444${obj.imageUrl}`
                          : ""
                      }
                      user={obj.user}
                      createdAt={obj.createdAt}
                      viewsCount={obj.viewsCount}
                      commentsCount={postComments.length} 
                      tags={obj.tags}
                      isEditable={userData?._id === obj.user._id}
                      onTagClick={handleTagClick}
                    />
                  );
                })}
        </Grid>

        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          {posts.status === "loaded" && (
            <CommentsBlock
              items={allComments.slice(0, 3)}
              isLoading={comments.status === "loading"}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};