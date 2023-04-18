const { listNFT, marketData ,getFillData} = require('./utils/nifty/nifty');

const Test = artifacts.require('./Test.sol');
const NFT = artifacts.require('./NFT.sol');

contract('Orderbook', (accounts) => {
  let test;
  let nft;

  const buyer = accounts[1];
  const seller = accounts[2];
  const executer = accounts[5];

  before(async () => {
    test = await Test.deployed();
    nft = await NFT.new();
  });

  describe('Test', () => {
    it('execute a listing', async () => {
      await nft.mint({
        from: seller
      });
    
      let tokenID = await nft.counter();
      tokenID = tokenID.toString();

      const list = await listNFT({
        marketAddress: marketData.contractAddress,
        userAddress: seller,
        price: '1',
        contractAddress: nft.address,
        tokenID,
        provider: web3.currentProvider
      });

      await nft.setApprovalForAll(marketData.proxyAddress, true, {
        from: seller
      });

      console.log(list);

      const tradeDetails = list;

      const data = await getFillData(marketData.contractAddress, buyer, executer, tradeDetails, list.makerAssetAmount);
      console.log(data);

      await test.buy(
        [marketData.contractAddress, data.value, data.data],
        {
          from: data.from,
          value: data.value
        });

      const newOwner = await nft.ownerOf(tokenID);
      assert.equal(newOwner, buyer, 'new owner is not buyer');
      console.log({
        seller, buyer, newOwner
      })

    });

    
  });
});
