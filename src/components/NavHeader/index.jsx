import Nullstack from "nullstack";
import { getAbbrAddrs } from "../../utils/user";
import "../../../flow/config";
import * as fcl from "@onflow/fcl";
import "./NavHeader.css";

export default class NavHeader extends Nullstack {
  isAdmin = false;

  initiate({ router }) {
    this.isAdmin = router.path.includes("admin");
  }

  handleLogout() {
    fcl.unauthenticate();
  }

  handleLogin() {
    fcl.logIn().then(() => {});
  }

  render({ authUser }) {
    return (
      <div class="nav_header">
        <div>
          <a href="/">
            <img src="/nft-logo.svg" alt="nft-logo" width={"auto"} />
          </a>
        </div>
        <div class="menu-items">
          <div class="admin-items">
            {authUser?.loggedIn ? (
              <>
                <a href="/admin">
                  <img src="/wallet-icon.svg" alt="wallet" />
                  {getAbbrAddrs(authUser?.addr)}
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
              <a href="/taps">{authUser?.balance} Taps</a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
