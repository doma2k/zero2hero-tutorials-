// Подключаемся к контракту
const contractAddress = "0x9a56598B9533a969BFD425311D750cc50BbF579a"; //Замените вашим контрактом
// Указываем ABI (Application Binary Interface) контракта
const abi = [{ "inputs": [], "stateMutability": "payable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "player", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "isWinner", "type": "bool" }, { "indexed": false, "internalType": "string", "name": "details", "type": "string" }], "name": "GamePlayed", "type": "event" }, { "inputs": [], "name": "minBet", "outputs": [{ "internalType": "uint64", "name": "", "type": "uint64" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "_optionByPlayer", "type": "uint8" }], "name": "playGame", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "payable", "type": "function" }];
// Подключаемся к web3 провайдеру (метамаск)
const provider = new ethers.providers.Web3Provider(window.ethereum, 97);

let contract;

provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(contractAddress, abi, signer);
        console.log(contract);
        getMinBet();
    });
});

// Creating function to play game
async function playGame(optionByPlayer, bnbValue) {
    const minBet = await contract.minBet();
    const betInput = document.getElementById("bet");
    const etherValue = ethers.utils.parseEther(bnbValue); // convert BNB to wei
    if (etherValue.lt(minBet)) {
        console.log(`Minimum bet is ${minBet} wei`);
        return;
    }
    const tx = await contract.playGame(optionByPlayer, { value: etherValue });

    contract.removeAllListeners("GamePlayed");

    const logsElement = document.getElementById("logs");
    contract.on("GamePlayed", (player, isWinner, details) => {
        const timestamp = new Date().toLocaleString();
        const logMessage = `[${timestamp}] ${tx.hash}\n Player: ${player}\nIs winner: ${isWinner}\nDetails: ${details}\n\n`;
        logsElement.innerText += logMessage;
    });
}

// Get minBet 
async function getMinBet() {
    const minBetElement = document.getElementById('min-bet-container');
    const minBet = await contract.minBet();
    const minBetInEther = ethers.utils.formatEther(minBet);
    const suffix = ' BNB'
    minBetElement.textContent += minBetInEther.toString() +suffix;
}

document.addEventListener("DOMContentLoaded", function () {
    // code that adds event listener goes here
    const betInput = document.getElementById('bet');
    const betError = document.getElementById('bet-error');

    betInput.addEventListener('blur', () => {
        if (!betInput.value) {
            betError.style.display = 'block';
        } else {
            betError.style.display = 'none';
        }
    });
});

