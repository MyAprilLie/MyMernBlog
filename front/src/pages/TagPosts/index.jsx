import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostsByTag } from "../../Redux/slices/posts";
import { Post } from "../../components/Post";

export const TagPosts = () => {
  const dispatch = useDispatch();
  const { tag } = useParams();
  const { posts } = useSelector((state) => state.posts);

  const isLoading = posts.status === "loading";

  useEffect(() => {
    dispatch(fetchPostsByTag(tag));
  }, [dispatch, tag]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        posts.items.map((post) => (
          <Post
            key={post._id}
            _id={post._id}
            title={post.title}
            imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ""}
            user={post.user}
            createdAt={post.createdAt}
            viewsCount={post.viewsCount}
            commentsCount={3}
            tags={post.tags}
          />
        ))
      )}
    </div>
  );
};
