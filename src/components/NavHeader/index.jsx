import Nullstack from "nullstack";
import { getUser, getAbbrAddrs } from "../../utils/user";
import "../../../flow/config";
import * as fcl from "@onflow/fcl";
import "./NavHeader.css";

export default class NavHeader extends Nullstack {
  user = null;
  isAdmin = false;
  addr = null;

  initiate({ router }) {
    this.user = getUser();
    this.addr = getAbbrAddrs(this.user.addr);
    this.isAdmin = router.path.includes("admin");
  }

  async update() {
    this.user = getUser();
  }

  handleLogout() {
    fcl.unauthenticate();

    this.user = getUser();
  }

  handleLogin() {
    fcl.logIn().then(() => {
      this.user = getUser();
    });
  }

  render({ instances }) {
    const { tap } = instances.application;

    return (
      <div class="nav_header">
        <div>
          <a href="/">
            <img src="/nft-logo.svg" alt="nft-logo" width={"auto"} />
          </a>
        </div>
        <div class="menu-items">
          <div class="admin-items">
            {this.user?.loggedIn ? (
              <>
                <a href="/admin">
                  <img src="/wallet-icon.svg" alt="wallet" />
                  {this.addr}
                </a>
                <a href="" onclick={this.handleLogout}>
                  <img src="/logout-icon.svg" alt="wallet" />
                  Logout
                </a>
              </>
            ) : (
              <a href="" onclick={this.handleLogin}>
                Login
              </a>
            )}
          </div>
          {!this.isAdmin && (
            <div class="navigation-items">
              <a href="/">Home</a>
              <a href="/wtf">WTF?</a>
              <a href="/explore">Explore</a>
              <a href="/taps">{tap.totalSupply} Taps</a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
