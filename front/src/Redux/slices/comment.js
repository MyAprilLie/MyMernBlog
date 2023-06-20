import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    const response = await axios.get(`/comments/post/${postId}`);
    return { postId, comments: response.data };
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    byPostId: {}, 
    status: "idle", 
  },
  reducers: {
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state.byPostId[postId]) {
        state.byPostId[postId] = [];
      }
      state.byPostId[postId].push(comment);
    },
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state.byPostId[postId] = comments;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { postId, comments } = action.payload;
      state.byPostId[postId] = comments.map((comment) => {
        return { ...comment, avatarUrl: "" }; 
      });
    });
    builder.addCase(fetchComments.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { addComment, setComments } = commentSlice.actions;
export const commentReducer = commentSlice.reducer;
