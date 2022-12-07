import contractAbi from "../abi/testContract.json";
import Web3 from "web3";
import { BASE_URL, FROM_ADDRESS, TO_ADDRESS_A } from "../constants";

const web3 = new Web3(BASE_URL);

export type LoginProps = {
  email: string;
  password: string;
};

export const validateUser = async ({ email, password }: LoginProps) => {
  const myContract = new web3.eth.Contract(contractAbi as any, TO_ADDRESS_A);
  const createReceiptCall = await web3.eth.call({
    from: FROM_ADDRESS,
    to: TO_ADDRESS_A,
    value: web3.utils.toWei("0", "ether"),
    gas: "1000000",
    data: myContract.methods.checkPassword(email, password).encodeABI(),
  });
  return Number(createReceiptCall) > 0;
};
// name:hello
// email:vireadiyaom003@gmail.com
// address:efgughruggr
// from_name:sanket
// reply_to:pipaliya@yopmail.com
// service_id:service_jhw9wtx
// template_id:template_9ij4wof
// user_id:maqeczJdxpsCtnA5A
