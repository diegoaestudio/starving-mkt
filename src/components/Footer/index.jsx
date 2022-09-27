import Nullstack from "nullstack";
import "./Footer.css";

export default class Footer extends Nullstack {
  render() {
    return (
      <div class="footer">
        <div class="left_side">
          <img src="/nft-logo.svg" alt="nft-logo" />
          <span>
            They may not have food, but you can help an NFT-less child with this
            buy one, give one opportunity. Every child deserves an NFT.
          </span>
        </div>
        <div class="right_side">
          <h2>Marketplace</h2>
          <ul>
            <li>
              <a href="/wtf">WTF</a>
            </li>
            <li>
              <a href="">Explore</a>
            </li>
            <li>
              <a href="">TAPS</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
