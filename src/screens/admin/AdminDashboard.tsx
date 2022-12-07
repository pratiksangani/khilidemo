import { Box, Button, Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import contractAbi from "../../abi/textContractB.json";
import "../../App.scss";
import { BASE_URL, FROM_ADDRESS, TO_ADDRESS_B } from "../../constants";

type Props = {};

const headerList = ["No.", "Name", "Email", "Address", "Z-Estimate"];
const AdminDashboard = (props: Props) => {
  const navigate = useNavigate();
  const web3 = new Web3(BASE_URL);
  const [data, setData] = useState<any>([]);
  console.log("🚀 ~ file: AdminDashboard.tsx:16 ~ AdminDashboard ~ data", data);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const myContract = new web3.eth.Contract(contractAbi as any, TO_ADDRESS_B);

    const dataLength = await web3.eth.call({
      from: FROM_ADDRESS,
      to: TO_ADDRESS_B,
      value: web3.utils.toWei("0", "ether"),
      gas: "1000000",
      data: myContract.methods.counter().encodeABI(),
    });

    if (Number(dataLength) === 0) {
      alert("No data found");
    } else {
      for (let i = 0; i < Number(dataLength); i++) {
        const createReceiptCall = await web3.eth.call({
          from: FROM_ADDRESS,
          to: TO_ADDRESS_B,
          value: web3.utils.toWei("0", "ether"),
          gas: "1000000",
          data: myContract.methods.dataStore(i).encodeABI(),
        });

        const value = Object.values(
          web3.eth.abi.decodeParameters(
            ["string", "string", "string", "uint256"],
            createReceiptCall
          )
        );

        if (value[0] !== "") {
          setData((e: any) => [...e, value]);
        }
      }
    }
  };

  const viewList = useMemo(
    () =>
      data
        .filter(
          (v: string[], i: number, a: any[]) =>
            a.findIndex((v2) => v2[2] === v[2]) === i
        )
        .map((item: string[], index: number) => [
          index + 1,
          ...item.slice(0, 4),
        ]),
    [data]
  );

  return (
    <div className="base-view center">
      <Card className="login-card" component={"form"} elevation={5}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <Button
            onClick={() => {
              localStorage.setItem("ADMIN_LOGIN_DETAIL", "");
              navigate(-1);
            }}
          >
            LOGOUT
          </Button>
        </Box>
        <table className="table-style">
          <tr>
            {headerList.map((item, index) => (
              <th className={index !== 4 ? "border-right" : ""}>{item}</th>
            ))}
          </tr>
          {viewList.map((item: string[]) => (
            <tr>
              {item.map((subItem, subIndex) => (
                <td className={subIndex !== 4 ? "border-right" : ""}>
                  {subItem}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </Card>
    </div>
  );
};

export default AdminDashboard;
