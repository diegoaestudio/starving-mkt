import "./NFTList.css";

const NFTList = ({ nfts = [] }) => {
  return (
    <div class="nft-list">
      {nfts.map((nft) => (
        <div class="nft" key={nft._id}>
          <img src={nft.img} alt={nft.name} />
          <div class="nft-info">
            <span class="nft-name">{nft.name}</span>
            <span class="nft-owner">{nft.addr}</span>
            <span class="nft-price">Price: {nft.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTList;
