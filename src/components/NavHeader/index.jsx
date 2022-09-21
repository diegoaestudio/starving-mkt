import Nullstack from "nullstack";
import "./NavHeader.scss";

export default class NavHeader extends Nullstack {
  render() {
    return (
      <div class="nav_header">
        <div>
          <img src="/nft-logo.svg" alt="nft-logo" width={"auto"} />
        </div>
        <div class="menu-items">
          <a href="/">Home</a>
          <a href="/wtf">WTF?</a>
          <a href="/explore">Explore</a>
          <a href="/taps">Taps</a>
          <a href="">1.345 Taps</a>
          <a href="/my-account">My Account</a>
        </div>
      </div>
    );
  }
}
