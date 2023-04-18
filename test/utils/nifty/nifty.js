const { default: BigNumber } = require('bignumber.js');
const { ethers } = require("ethers");
const ExchangeABI = require('./ExchangeABI.js');
const LibAssetDataABI = require('./LibAssetDataABI.js')
const sign = require('./sign.js');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const marketData = {
  contractAddress: '0x893EF461B2e50c04F4b5AEbe20a33CCC7D2440Ad',
  proxyAddress: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
  chainId: 5,
};

const libAssetDataAddress = '0x4FB6f91904D2318274CDB5812480835f6859dFEa';

const encodeERC721AssetData = (contractAddress, tokenID) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const LibAssetDataContract = new ethers.Contract(libAssetDataAddress, LibAssetDataABI, provider);

  return LibAssetDataContract.callStatic.encodeERC721AssetData(
    contractAddress,
    tokenID,
  );
}

const encodeERC20AssetData = (paymentTokenAddress = ZERO_ADDRESS) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const LibAssetDataContract = new ethers.Contract(libAssetDataAddress, LibAssetDataABI, provider);

  return LibAssetDataContract.callStatic.encodeERC20AssetData(
    paymentTokenAddress,
  );
}

const listNFT = async ({
  marketAddress,
  userAddress,
  price,
  contractAddress,
  tokenID,
  provider,
}) => {
  const makerAssetData = await encodeERC721AssetData(contractAddress, tokenID, userAddress);
  const takerAssetData = await encodeERC20AssetData();

  const order = {
    chainId: Number(marketData.chainId),
    exchangeAddress: marketAddress,
    makerAddress: userAddress,
    takerAddress: ZERO_ADDRESS,
    senderAddress: ZERO_ADDRESS,
    royaltiesAddress: ZERO_ADDRESS,
    expirationTimeSeconds: new BigNumber(Math.round((Date.now() / 1000) + 315569520)).toFixed(),
    salt: Math.round((Date.now() / 1000)),
    makerAssetAmount: web3.utils.toWei(String(price)),
    takerAssetAmount: '1',
    makerAssetData,
    takerAssetData,
    royaltiesAmount: 0
  };

  const signedOrder = await sign(
    provider,
    order,
    userAddress,
    marketData.chainId,
    marketAddress
  );

  return {
    ...signedOrder
  }
}

const getFillData = async (address, user, from, listing, value) => {
  const provider = new ethers.providers.JsonRpcProvider();

  const contract = new ethers.Contract(address, ExchangeABI, provider);
  return contract.populateTransaction.fillOrderFor(
    listing,
    listing.signature,
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    user,
    {
      value: value,
      from: from
    }
  );
}

exports.listNFT = listNFT;
exports.marketData = marketData;
exports.getFillData = getFillData;