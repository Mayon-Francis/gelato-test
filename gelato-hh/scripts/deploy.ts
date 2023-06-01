import { ethers } from 'hardhat';

async function main() {
  const Counter = await ethers.getContractFactory('Counter');
  const counter = await Counter.deploy();

  await counter.deployed();
  console.log('Counter deployed to:', counter.address);

  const Resolver = await ethers.getContractFactory('CounterResolver');
  const resolver = await Resolver.deploy();
  await resolver.deployed();
  console.log('Resolver deployed to:', resolver.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
