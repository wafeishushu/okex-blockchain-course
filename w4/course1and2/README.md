# Week4 - Course1 and 2

## 1.本地ganache运行截图

### 1.1部署UniswapV2Factory
```sh
cd ../v2-core
yarn
npx hardhat run scripts/deploy-factory.js --network ganache
```
![image1](./本地部署Factory.png)

### 1.2部署UniswapV2Router和WETH
```sh
cd ../v2-periphery
yarn
npx hardhat run scripts/deploy-router-weth.js --network ganache 
```
![image1](./部署Router和WETH.png)

### 1.3本地部署Token和MyTokenMarket并运行
```sh
cd my-token-market-project/
npx hardhat run scripts/run.js --network ganache 
```
![image1](./本地部署运行MyTokenMarket.png)