import Nullstack from "nullstack";
import ButtonLink from "../ButtonLink";
import "./Kindness.css";

export default class Kindness extends Nullstack {
  render() {
    return (
      <div class="kindness">
        <div class="kindness__speech">
          <img src="/kindness-speech.svg" alt="nft-logo" width={"auto"} />
          <div class="speech">
            They may not have food, but you can help an NFT-less child with this
            buy one, give one opportunity. Every child deserves an NFT.
          </div>
          <div class="speech__buttons">
            <ButtonLink linkPath="/explore">Explore</ButtonLink>
            <ButtonLink linkPath="/taps" className="btn-pink-ghost">
              Buy Taps
            </ButtonLink>
          </div>
        </div>
        <div class="kindness__img">
          <img src="/kindness-img.svg" alt="nft-logo" width={"auto"} />
        </div>
      </div>
    );
  }
}
