// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './interfaces/IUniswapV2Factory.sol';
import '@openzeppelin/contracts/interfaces/IERC20.sol';
import './interfaces/IUniswapV2Pair.sol';

interface IV3SwapRouter {
    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut);
}

interface IV2SwapRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts);
}

interface IMyToken {
    function mint(address _account, uint256 _amount) external returns (bool);
}

contract FlashSwapV2AndV3 {
    address private immutable v2Router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private immutable v2Factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private immutable v3Router = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address public tokenA;
    address public tokenB;
    address public tokenPair;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    //固定借tokenA
    function swapLoanToken(uint256 _amount) public {
        //取配对合约地址
        tokenPair = IUniswapV2Factory(v2Factory).getPair(tokenA, tokenB);
        require(tokenPair != address(0), 'null token');
        address token0 = IUniswapV2Pair(tokenPair).token0();
        address token1 = IUniswapV2Pair(tokenPair).token1();
        uint256 amount0Out = tokenA == token0 ? _amount : 0;
        uint256 amount1Out = tokenA == token1 ? _amount : 0;
        //借款数据
        bytes memory data = abi.encode(tokenA, _amount);
        IUniswapV2Pair(tokenPair).swap(amount0Out, amount1Out, address(this), data);
    }

    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) public {
        //借款数据
        (address borrowToken, uint256 amount) = abi.decode(data, (address, uint256));
        // 该调用必须由tokenPair发起
        require(msg.sender == tokenPair, 'ERR tokenPairAddr');
        require(sender == address(this), 'ERR sender');
        //只能借款一种币
        require(amount0 == 0 || amount1 == 0, 'amount0 or amount1 should be zero');
        //服务费
        uint256 fee = ((amount * 3) / 977) + 1;
        //一共该还款的金额
        uint256 amountToRepay = fee + amount;

        //拿tokenA去V3兑换成tokenB
        //授权
        IERC20(borrowToken).approve(v3Router, amount);
        // 开始兑换
        uint256 v3TokenbAmountOut = IV3SwapRouter(v3Router).exactInput{value: 0}(
            IV3SwapRouter.ExactInputParams({
                path: abi.encodePacked(borrowToken, uint24(3000), tokenB),
                recipient: address(this),
                deadline: block.timestamp + 2000,
                amountIn: amount,
                amountOutMinimum: 0
            })
        );

        //计算需要还款多少tokenB
        address[] memory path1 = new address[](2);
        path1[0] = tokenB;
        path1[1] = borrowToken;
        uint256[] memory amounts1 = IV2SwapRouter(v2Router).getAmountsIn(amountToRepay, path1);

        if (v3TokenbAmountOut < amounts1[0]) {
            IMyToken(tokenB).mint(address(this), amounts1[0] - v3TokenbAmountOut);
            IERC20(tokenB).transfer(tokenPair, amounts1[0]);
        } else {
            //多余的钱可以转给用户
            IERC20(tokenB).transfer(tokenPair, v3TokenbAmountOut - amounts1[0]);
        }
    }
}
