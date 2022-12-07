import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../utility/ContextProvider";
import AppToast from "../../components/AppToast";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../constants";
type Props = {};

type LoginProps = {
  email: string;
  password: string;
};

const initialData: LoginProps = {
  email: "",
  password: "",
};

const AdminLogin = (props: Props) => {
  const navigate = useNavigate();
  const { setIsAdmin } = useContext(MyContext);
  const [data, setData] = useState<LoginProps>(initialData);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const handelSubmit = async () => {
    if (data.email === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
      localStorage.setItem("ADMIN_LOGIN_DETAIL", JSON.stringify(data));
      setIsAdmin(true);
      setSuccess("Login Successful");
    } else {
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
            Admin Sign In
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
          <Button variant="contained" onClick={handelSubmit}>
            LOGIN
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
          navigate("/admin/dashboard");
        }}
      />
    </div>
  );
};

export default AdminLogin;
