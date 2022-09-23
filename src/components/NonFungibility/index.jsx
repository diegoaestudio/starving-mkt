import Nullstack from "nullstack";
import "./NonFungibility.css";

export default class NonFungibility extends Nullstack {
  render() {
    return (
      <div class="non-fungibility">
        <img src="/non-fungibility.svg" alt="nft-logo" width={"auto"} />
        <span>
          What Uncle Ben and Uncle Satoshi mean is that you can use your “power”
          to change the world... by minting a few NFTs.
        </span>
        <button class="btn_buy_nft">BUY A NFT TO A STARVING CHILD</button>
      </div>
    );
  }
}
