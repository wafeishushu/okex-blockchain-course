# Week5 - Course1

## 1.部署Token到goerli
```sh
cd flash-swap-project
npx hardhat run scripts/deploy-tokenA.js --network goerli
npx hardhat run scripts/deploy-tokenB.js --network goerli
```
![image1](./部署tokenAB.png)

## 2.UniswapV2和V3添加流动性
![image1](./V2加流动性.png)
![image1](./V3加流动性.png)
![image1](./V3加流动性2.png)


## 3.UniswapV2和V3闪电兑换
```sh
cd flash-swap-project
npx hardhat run scripts/call-flash-swap.js --network goerli
```
![image1](./V2加流动性.png)
![image1](./V3加流动性.png)
![image1](./V3加流动性2.png)