import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import Web3 from "web3";
import contractAbi from "../../abi/textContractB.json";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import {
  BASE_URL,
  FROM_ADDRESS,
  PRIVATE_KEY,
  TO_ADDRESS_A,
  TO_ADDRESS_B,
} from "../../constants";
import AppToast from "../../components/AppToast";
import { validateEmail } from "../../constants/common";
type Props = {};

type SignUpProps = {
  name: string;
  email: string;
  userAddress: string;
  zestimate: number;
};

const initialData: SignUpProps = {
  name: "",
  email: "",
  userAddress: "",
  zestimate: 0,
};

const HomeScreen = (props: Props) => {
  const form = useRef(null);
  const navigate = useNavigate();
  const web3 = new Web3(BASE_URL);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SignUpProps>(initialData);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const handelSubmit = async () => {
    const { name, email, userAddress, zestimate } = data;

    if (!name) {
      setError("Name is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!userAddress) {
      setError("Address is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid Email");
      return;
    }

    setLoading(true);
    emailjs
      .sendForm(
        "service_jhw9wtx",
        "template_9ij4wof",
        form.current ?? "",
        "maqeczJdxpsCtnA5A"
      )
      .then(async (result) => {
        const myContract = new web3.eth.Contract(
          contractAbi as any,
          TO_ADDRESS_B
        );
        const createTransaction = await web3.eth.accounts.signTransaction(
          {
            from: FROM_ADDRESS,
            to: TO_ADDRESS_B,
            value: web3.utils.toWei("0", "ether"),
            gas: "1000000",
            data: myContract.methods
              .addData(name, email, userAddress, zestimate)
              .encodeABI(),
          },
          PRIVATE_KEY
        );

        try {
          const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction ?? ""
          );
          setLoading(false);
          setData(initialData);
          setSuccess("Data Added Succesfully");
        } catch (e) {
          setLoading(false);
          setError("Account balance is low");
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className="base-view center">
      <Card className="login-card" component={"form"} elevation={5}>
        <form ref={form}>
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
              Home Screen
            </Typography>
            <TextField
              size="small"
              type="text"
              label="Name"
              name="name"
              value={data.name}
              variant="outlined"
              sx={{ minWidth: 300 }}
              onChange={(v) => setData((e) => ({ ...e, name: v.target.value }))}
            />
            <TextField
              size="small"
              type="text"
              variant="outlined"
              value={data.email}
              name="to_email"
              label="Email"
              sx={{ minWidth: 300 }}
              onChange={(v) =>
                setData((e) => ({ ...e, email: v.target.value }))
              }
            />
            <TextField
              size="small"
              type="text"
              variant="outlined"
              value={data.userAddress}
              name="address"
              label="Address"
              sx={{ minWidth: 300 }}
              onChange={(v) =>
                setData((e) => ({ ...e, userAddress: v.target.value }))
              }
            />
            <input hidden name="from_name" value="Parth" onChange={() => {}} />
            <input
              hidden
              name="reply_to"
              value="patoliaparth123@gmail.com"
              onChange={() => {}}
            />

            <Button
              variant="contained"
              disabled={loading}
              onClick={handelSubmit}
            >
              {loading ? <CircularProgress size={23} /> : "SUBMIT"}
            </Button>
          </Box>
        </form>
      </Card>
      <AppToast text={error} setText={() => setError(undefined)} />
      <AppToast
        text={success}
        type="success"
        setText={() => {
          setSuccess(undefined);
        }}
      />
    </div>
  );
};

export default HomeScreen;
