import Nullstack from "nullstack";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import NavHeader from "../../components/NavHeader";
import { getUser } from "../../utils/user";
import "./AdminNFTList.scss";

class AdminNFTList extends Nullstack {
  nfts = [];

  async prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  static async getNFTs({ database, user }) {
    return database.collection("nfts").find({ addr: user.addr }).toArray();
  }

  async initiate() {
    const user = getUser();
    this.nfts = await this.getNFTs({ user });
  }

  render() {
    return (
      <>
        <NavHeader />
        <main class="admin-nft-list">
          <aside>
            <ButtonLink linkPath="/admin/create">Create NFT</ButtonLink>

            <a href="/admin/nfts">NFTS</a>
          </aside>
          <div class="nfts">
            <h2>NFTs</h2>
            <span>Manage all your nfts</span>

            <div class="filters">
              <Button>All</Button>
              <Button>Minted</Button>
              <Button>Sold</Button>
              <Button>Listed</Button>
            </div>

            <div class="nft-list">
              {this.nfts.map((nft) => (
                <div class="nft" key={nft._id}>
                  <img src={nft.img} alt={nft.name} />
                  <div class="nft-info">
                    <span class="nft-name">{nft.name}</span>
                    <span class="nft-owner">{nft.addr}</span>
                    <span class="nft-price">Price: {nft.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default AdminNFTList;
