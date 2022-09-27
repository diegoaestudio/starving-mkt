import Nullstack from "nullstack";
import ButtonLink from "../ButtonLink";
import "./Charity.css";

export default class Charity extends Nullstack {
  render() {
    return (
      <>
        <div class="charity">
          <img src="/treat-charity.svg" alt="nft-logo" />
          <p>
            Bringing attention to effective altruism, and reminding you that not
            all charities are created equal
          </p>
          <ButtonLink>Connect Your wallet</ButtonLink>
        </div>
        <div class="charity">
          <img src="/giving-charities.svg" alt="nft-logo" />
          <p>
            Some “charities” manipulate emotions with imagery. This helps
            fundraise, but not necessarily those in need. Treat your charity
            like any other investment. Verify that your hard-earned money
            benefits those in greatest need. Know what percentage of each
            donation is retained vs. distributed!
          </p>
          <p>
            This project brings awareness to the issue of inefficient charities
            that keep most of the funds they raise internally. Let’s help
            altruistic people give to the most efficient, effective charities!
          </p>
          <p>
            Note: All monetary proceeds from this project will be donated to
            charities deemed effective by GiveWell.
          </p>
          <ButtonLink>Giving what we can</ButtonLink>
        </div>
      </>
    );
  }
}
