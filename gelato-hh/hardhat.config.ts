import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    bb: {
      url: "https://rpc.dev.buildbear.io/mayon",
    }
  }
};

export default config;
