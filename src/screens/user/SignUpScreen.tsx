import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import contractAbi from "../../abi/testContract.json";
import Web3 from "web3";
import {
  BASE_URL,
  FROM_ADDRESS,
  PRIVATE_KEY,
  TO_ADDRESS_A,
} from "../../constants";
import AppToast from "../../components/AppToast";
import { validateEmail } from "../../constants/common";

type Props = {};

type SignUpProps = {
  firstName: string;
  password: string;
  password1: string;
  lastName: string;
  email: string;
  dob: number;
};

const initialData: SignUpProps = {
  firstName: "",
  password: "",
  password1: "",
  lastName: "",
  email: "",
  dob: +new Date(),
};

const SignUpScreen = (props: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [data, setData] = useState<SignUpProps>(initialData);
  const web3 = new Web3(BASE_URL);

  const handelSubmit = async () => {
    const { firstName, lastName, password, password1, email, dob } = data;

    if (!email || !validateEmail(email)) {
      setError("Invalid Email");
      return;
    }

    if (password.length === 0) {
      setError("Password is Required");
      return;
    }
    if (password !== password1) {
      setError("Password doesn't match");
      return;
    }

    setLoading(true);
    const myContract = new web3.eth.Contract(contractAbi as any, TO_ADDRESS_A);

    const createReceiptCall = await web3.eth.call({
      from: FROM_ADDRESS,
      to: TO_ADDRESS_A,
      value: web3.utils.toWei("0", "ether"),
      gas: "1000000",
      data: myContract.methods
        .addData(firstName, lastName, email, dob, password)
        .encodeABI(),
    });

    if (Number(createReceiptCall) === 0) {
      setLoading(false);
      setError("Account already exist with this email");
    } else {
      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          from: FROM_ADDRESS,
          to: TO_ADDRESS_A,
          value: web3.utils.toWei("0", "ether"),
          gas: "1000000",
          data: myContract.methods
            .addData(firstName, lastName, email, dob, password)
            .encodeABI(),
        },
        PRIVATE_KEY
      );
      try {
        const createReceipt = await web3.eth.sendSignedTransaction(
          createTransaction.rawTransaction ?? ""
        );
        setSuccess("Account created successfully");
        setLoading(false);

        console.log(
          "🚀 ~ file: SignUpScreen.tsx:55 ~ signUp ~ createReceipt",
          createReceipt
        );
      } catch (e) {
        setLoading(false);
        setError("Account balance is low");
      }
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
            Sign Up
          </Typography>

          <TextField
            size="small"
            type="text"
            variant="outlined"
            value={data.email}
            label="Email"
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
          <TextField
            size="small"
            type="password"
            variant="outlined"
            value={data.password1}
            label="Confirm Password"
            sx={{ minWidth: 300 }}
            onChange={(v) =>
              setData((e) => ({ ...e, password1: v.target.value }))
            }
          />

          <Button variant="contained" disabled={loading} onClick={handelSubmit}>
            {loading ? <CircularProgress size={23} /> : "SIGN UP"}
          </Button>
        </Box>

        <Typography
          sx={{ fontSize: 12, cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Already Have a Account?
        </Typography>
      </Card>
      <AppToast text={error} setText={() => setError(undefined)} />
      <AppToast
        text={success}
        type="success"
        setText={() => {
          navigate(-1);
          setSuccess(undefined);
        }}
      />
    </div>
  );
};

export default SignUpScreen;
