import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginProps, validateUser } from "../../actions/user";
import AppToast from "../../components/AppToast";
import { validateEmail } from "../../constants/common";
import { MyContext } from "../../utility/ContextProvider";
type Props = {};

const initialData: LoginProps = {
  email: "",
  password: "",
};

const LoginScreen = (props: Props) => {
  const navigate = useNavigate();
  const { setIsUser } = useContext(MyContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<LoginProps>(initialData);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const handelSubmit = async () => {
    const { email, password } = data;
    if (email.length === 0) {
      setError("Email is Required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid Email");
      return;
    }
    if (password.length === 0) {
      setError("Password is Required");
      return;
    }

    setLoading(true);
    const isValid = await validateUser(data);
    if (isValid) {
      setLoading(false);
      setIsUser(true);
      localStorage.setItem("USER_LOGIN_DETAIL", JSON.stringify(data));
      setSuccess("Authentication completed but nothing to show");
    } else {
      setLoading(false);
      setError("Incorrect Password or Account doesn't exist");
    }
  };

  return (
    <div className="base-view center">
      <Card className="login-card" component={"form"} elevation={5}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Sign In
          </Typography>
          <TextField
            size="small"
            type="text"
            label="Email"
            value={data.email}
            variant="outlined"
            sx={{ minWidth: 300 }}
            onChange={(v) => setData((e) => ({ ...e, email: v.target.value }))}
          />
          <TextField
            size="small"
            type="password"
            variant="outlined"
            value={data.password}
            label="Password"
            sx={{ minWidth: 300 }}
            onChange={(v) =>
              setData((e) => ({ ...e, password: v.target.value }))
            }
          />
          <Button variant="contained" disabled={loading} onClick={handelSubmit}>
            {loading ? <CircularProgress size={23} /> : "LOGIN"}
          </Button>
        </Box>

        <Typography
          sx={{ fontSize: 12, cursor: "pointer" }}
          onClick={() => navigate("/signUp")}
        >
          Create New Account?
        </Typography>
      </Card>
      <AppToast text={error} setText={() => setError(undefined)} />
      <AppToast
        text={success}
        type="success"
        setText={() => {
          setSuccess(undefined);

          navigate("/home");
        }}
      />
    </div>
  );
};

export default LoginScreen;
