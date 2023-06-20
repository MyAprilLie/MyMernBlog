import React from "react";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../Redux/slices/comment";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ postId }) => {
  const [commentText, setCommentText] = React.useState("");
  const dispatch = useDispatch();
  const avatarUrl = useSelector((state) => state.auth.data.avatarUrl);

  const handleCommentSubmit = () => {
    const commentData = {
      postId: postId,
      text: commentText,
    };

    axios
      .post("/comments", commentData)
      .then((res) => {
        console.log("Comment created:", res.data);
        dispatch(addComment(res.data)); // Обновляем состояние комментариев в Redux
        setCommentText("");
      })
      .catch((err) => {
        console.error("Error creating comment:", err);
      });
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button variant="contained" onClick={handleCommentSubmit}>
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
