import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import AdminSideBar from "../../components/AdminSidebar";
import Button from "../../components/Button";
import NavHeader from "../../components/NavHeader";
import NFTList from "../../components/NFTList";
import { getUser } from "../../utils/user";
import "./AdminNFTList.css";
import { GET_USER_NFTS } from "../../cadence/scripts";

class AdminNFTList extends Nullstack {
  nfts = [];

  async prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  static async getNFTs({ database, user }) {
    return database.collection("nfts").find({ addr: user.addr }).toArray();
  }

  async getUserNFTs({ addr }) {
    console.log("loading");
    try {
      const result = await fcl.query({
        cadence: GET_USER_NFTS,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        args: (arg, t) => [arg(addr, t.Address)],
      });

      console.log({ result });
      return result;
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
    }
  }

  async initiate() {
    const user = getUser();

    this.nfts = await this.getNFTs({ user });
  }

  async hydrate() {
    const user = getUser();

    const test = await this.getUserNFTs({ addr: user.addr });

    console.log({ test });
  }

  render() {
    return (
      <>
        <NavHeader />
        <main class="admin-nft-list">
          <AdminSideBar />
          <div class="nfts">
            <h2>NFTs</h2>
            <span>Manage all your nfts</span>

            <div class="filters">
              <Button>All</Button>
              <Button>Minted</Button>
              <Button>Sold</Button>
              <Button>Listed</Button>
            </div>

            <NFTList nfts={this.nfts} />
          </div>
        </main>
      </>
    );
  }
}

export default AdminNFTList;
