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

type Props = {};

type SignUpProps = {
  firstName: string;
  password: string;
  lastName: string;
  email: string;
  dob: string;
};

const initialData: SignUpProps = {
  firstName: "",
  password: "",
  lastName: "",
  email: "",
  dob: "",
};

const SignUpScreen = (props: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SignUpProps>(initialData);
  const web3 = new Web3(BASE_URL);

  const handelSubmit = async () => {
    setLoading(true);
    const { firstName, lastName, password, email, dob } = data;
    const myContract = new web3.eth.Contract(contractAbi as any, TO_ADDRESS_A);

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: FROM_ADDRESS,
        to: TO_ADDRESS_A,
        value: web3.utils.toWei("0", "ether"),
        gas: "1000000",
        data: myContract.methods
          .addData(firstName, lastName, email, +new Date(dob), password)
          .encodeABI(),
      },
      PRIVATE_KEY
    );
    const createReceiptCall = await web3.eth.call({
      from: FROM_ADDRESS,
      to: TO_ADDRESS_A,
      value: web3.utils.toWei("0", "ether"),
      gas: "1000000",
      data: myContract.methods
        .addData(firstName, lastName, email, +new Date(dob), password)
        .encodeABI(),
    });

    if (Number(createReceiptCall) === 0) {
      setLoading(false);
      alert("Account already exist with this email");
    } else {
      try {
        const createReceipt = await web3.eth.sendSignedTransaction(
          createTransaction.rawTransaction ?? ""
        );
        setLoading(false);
        navigate(-1);
        console.log(
          "🚀 ~ file: SignUpScreen.tsx:55 ~ signUp ~ createReceipt",
          createReceipt
        );
      } catch (e) {
        setLoading(false);
        alert("Account balance is low");
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
            label="First Name"
            value={data.firstName}
            variant="outlined"
            sx={{ minWidth: 300 }}
            onChange={(v) =>
              setData((e) => ({ ...e, firstName: v.target.value }))
            }
          />
          <TextField
            size="small"
            type="text"
            variant="outlined"
            value={data.lastName}
            label="Address"
            sx={{ minWidth: 300 }}
            onChange={(v) =>
              setData((e) => ({ ...e, lastName: v.target.value }))
            }
          />
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
            type="date"
            variant="outlined"
            value={data.dob}
            sx={{ minWidth: 300 }}
            onChange={(v) => setData((e) => ({ ...e, dob: v.target.value }))}
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
    </div>
  );
};

export default SignUpScreen;
