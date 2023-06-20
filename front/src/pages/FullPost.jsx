import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByTag } from "../Redux/slices/posts";
import { fetchComments, setComments } from "../Redux/slices/comment";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.byPostId[id] || []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await axios.get(`/posts/${id}`);
        setData(postResponse.data);
        setLoading(false);
    
        dispatch(fetchComments(id)).then((commentsResponse) => {
          dispatch(setComments(commentsResponse.payload));
        });
      } catch (err) {
        console.warn(err);
        alert("Ошибка при получении статьи или комментариев");
      }
    };
    

    fetchData();
  }, [id, dispatch]);

  const handleTagClick = (tag) => {
    dispatch(fetchPostsByTag(tag)).then(() => {
      navigate(`/posts/tags/${tag}`);
    });
  };

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        data={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost
        onTagClick={handleTagClick}
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={comments} isLoading={comments.status === "loading"}>
        <Index postId={data._id} />
      </CommentsBlock>
    </>
  );
};
