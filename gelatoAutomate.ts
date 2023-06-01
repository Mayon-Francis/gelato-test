import { AutomateSDK, TaskTransaction } from '@gelatonetwork/automate-sdk';
import { ethers } from 'ethers';
const chainId = 80001;
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.dev.buildbear.io/mayon'
);
const signer = provider.getSigner();
const automate = new AutomateSDK(chainId, signer);

const targetAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "count",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "increaseCount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastExecuted",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const resolverAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_counterAddress",
          "type": "address"
        }
      ],
      "name": "checker",
      "outputs": [
        {
          "internalType": "bool",
          "name": "canExec",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "execPayload",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const targetInterface = new ethers.utils.Interface(targetAbi);
const resolverInterface = new ethers.utils.Interface(resolverAbi);

const targetSelector = targetInterface.getSighash('increaseCount');
console.log('Function called on target contract: ', {
  format: targetInterface.getFunction('increaseCount').format('minimal'),
  selector: targetSelector,
});

const resolverSelector = resolverInterface.getSighash('checker');
const resolverExecData = resolverInterface.encodeFunctionData('checker', [
  '0xDFF52C448eDfc620B551e4493d432F0d95af35Ab',
]);
console.log('Function called on resolver contract: ', {
  format: resolverInterface.getFunction('checker').format('minimal'),
  selector: resolverSelector,
  resolverExecData: resolverExecData,
});

async function createNewTask() {
  interface CreateTaskOptions {
    name: string; // your task name

    // Function to execute
    execAddress: string; // address of your target smart contract
    execSelector: string; // function selector to execute on your target smart contract
    execAbi?: string; // ABI of your target smart contract

    // Proxy caller
    dedicatedMsgSender: boolean; // task will be called via a dedicated msg.sender which you can whitelist (recommended: true)

    // Optional: Pre-defined / static target smart contract inputs
    execData?: string; // exec call data

    // Optional: Dynamic target smart contract inputs (using a resolver)
    resolverAddress?: string; // resolver contract address
    resolverData?: string; // resolver call data (encoded data with function selector)
    resolverAbi?: string; // your resolver contract ABI

    // Optional: Time based task params
    interval?: number; // execution interval in seconds
    startTime?: number; // start timestamp in seconds or 0 to start immediately (default: 0)

    // Optional: Single execution task
    singleExec?: boolean; // task cancels itself after 1 execution if true.

    // Optional: Payment params
    useTreasury?: boolean; // use false if your task is self-paying (default: true)
  }

  const params: CreateTaskOptions = {
    name: 'TEST',
    execAddress: '0xDFF52C448eDfc620B551e4493d432F0d95af35Ab',
    execAbi: JSON.stringify(targetAbi),
    execSelector: targetSelector,
    // execData:
    //   '0x3323b467000000000000000000000000a6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000a6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000000',
    dedicatedMsgSender: true,
    // singleExec: true,
    resolverAddress: '0x655bCa1846990DecEf7B250E9269BCaF76De7D2b',
    resolverData: resolverExecData,
  };
  const { taskId, tx }: TaskTransaction = await automate.createTask(params);
  const receipt = await tx.wait();
  console.log({
    msg: 'Task created',
    taskId: taskId,
    hash: receipt.transactionHash,
    status: receipt.status,
  });
}

async function cancelTask() {
  const taskId =
    '0x4145efec9fe0df95a3a8c46ab57af4b76688754cb473145d05d9834dcde4abc1';
  const { tx }: TaskTransaction = await automate.cancelTask(taskId);
  const receipt = await tx.wait();
  console.log({
    msg: 'Task cancelled',
    hash: receipt.transactionHash,
    status: receipt.status,
    taskId: taskId,
  });
}

// cancelTask();
createNewTask();
