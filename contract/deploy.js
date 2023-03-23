const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    // console.log(process.env.RPC_URL)
    const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // console.log(account)

    const abi = fs.readFileSync("./game_sol_RockPaperScissors.abi", "utf-8");
    const bin = fs.readFileSync("./game_sol_RockPaperScissors.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, bin, account);
    const contract = await contractFactory.deploy({
        value: ethers.utils.parseEther("50")
    });
    //console.log(contract);
    // const contractReceipt = await contract.deployTransaction.wait(1);
    // console.log(`Contract address ${contract.address}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });