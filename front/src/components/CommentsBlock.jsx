import React from "react";
import { SideBlock } from "./SideBlock";
import { useSelector } from "react-redux";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

export const CommentsBlock = ({ children, items, isLoading = true }) => {
  const avatarUrl = useSelector((state) => state.auth.data?.avatarUrl || "");

  const showLoadingSkeleton = isLoading || !items || items.length === 0; 
  
  return (
    <SideBlock title="Комментарии">
      <List>
        {showLoadingSkeleton
          ? [...Array(5)]
          : items.map((comment, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {isLoading || !comment ? (
                      <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                      <Avatar src={avatarUrl} />
                    )}
                  </ListItemAvatar>
                  {isLoading || !comment ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Skeleton variant="text" height={25} width={120} />
                      <Skeleton variant="text" height={18} width={230} />
                    </div>
                  ) : (
                    <ListItemText
                      primary={comment.fullName}
                      secondary={comment.text}
                    />
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
      </List>
      {children}
    </SideBlock>
  );
};
