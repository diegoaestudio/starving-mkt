import Nullstack from "nullstack";
import "./Hope.css";

export default class Hope extends Nullstack {
  render() {
    return (
      <div class="hope">
        <img src="/hope.svg" alt="nft-logo" width={"auto"} />
        <div class="hope__sections_container">
          <div class="hope_section">
            <img src="/hope-poverty.svg" alt="" />
            <h2>Unimaginable poverty</h2>
            <p>
              There are children raised in unimaginable poverty. Not only are
              they deprived of clean water, nutritious food, reliable
              electricity and educational opportunities... but they also lack
              NFTs.
            </p>
          </div>
          <div class="hope_section">
            <img src="/hope-need-you.svg" alt="" />
            <h2>They need you</h2>
            <p>
              Please offer your support. Even if a warlord steals their family’s
              smartphone, you will have provided a “token” of non-fungible
              support.
            </p>
          </div>
          <div class="hope_section">
            <img src="/hope-bottle.svg" alt="" />
            <h2>A bottle of hope</h2>
            <p>
              Every dehydrated child can receive an NFT of a water bottle today,
              if only you can find it in your heart and crypto-wallet to give.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
