import Nullstack from "nullstack";
import "./BuyNft.scss";

export default class BuyNft extends Nullstack {
  render() {
    return (
      <div class="buy-nft">
        <div class="buy-nft__speech">
          <img src="/buy-nft-speech.svg" alt="nft-logo" width={"auto"} />
          <p>Treat your charity like your investments. Expect ROI.</p>
        </div>
        <div class="buy-nft__img">
          <img src="/buy-nft-side-b.svg" alt="nft-logo" width={"auto"} />
        </div>
      </div>
    );
  }
}
