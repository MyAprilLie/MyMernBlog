import React, { useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import CancelIcon from "@mui/icons-material/Cancel";

import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../Redux/slices/auth";

export const Registration = () => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarKey, setAvatarKey] = useState(Date.now()); // Unique key for Avatar component
  const avatarInputRef = useRef(null);
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Иван Иванов",
      email: "Ivan@test.ru",
      password: "12344",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert("Не удалось зарегистрироваться");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };
  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarKey(Date.now()); // Update the key to force re-render of Avatar component
    }
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setAvatarKey(Date.now()); // Update the key to force re-render of Avatar component
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <Avatar
            key={avatarKey} // Unique key for Avatar component
            sx={{ width: 100, height: 100, cursor: "pointer" }}
            onClick={handleAvatarClick}
            src={avatarPreview || undefined}
          >
            {avatarPreview ? null : <AddCircleOutlineIcon />}
          </Avatar>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          {avatarFile && (
            <CancelIcon
              className={styles.cancelIcon}
              onClick={handleCancelAvatar}
            />
          )}
        </div>
        <TextField
          className={styles.field}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", {
            required: "Поле обязательно для заполнения",
          })}
          fullWidth
          label="Полное имя"
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register("email", {
            required: "Поле обязательно для заполнения",
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register("password", {
            required: "Поле обязательно для заполнения",
          })}
          fullWidth
          label="Пароль"
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
