import Button from "../Button";
import "./NFTList.css";

const NFTList = ({ nfts = [], onSelectId, onPurchase, mode = "explore" }) => {
  return (
    <div class="nft-list">
      {nfts.map((nft) => (
        <div class="nft" key={nft._id}>
          <img src={nft.img} alt={nft.name} />
          <div class="nft-info">
            <a href={`/nft/${nft._id}`} class="nft-name">
              {nft.name}
            </a>
            <span class="nft-owner">{nft.addr}</span>
            <span class="nft-owner">{nft.id}</span>
            <span class="nft-price">Price: {nft.price}</span>
            {mode === "explore" ? (
              <Button
                className="btn-pink"
                onclick={() => onPurchase(JSON.parse(nft.id))}
              >
                Purchase
              </Button>
            ) : (
              <Button
                className={nft.forSale && "btn-pink"}
                disable={nft.forSale}
                onclick={() => onSelectId(nft.id)}
              >
                {nft.forSale ? "For Sale" : "Select"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTList;
