import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import { getUser } from "../../utils/user";
import "./Admin.css";
import { MINT_TOKENS, SETUP_ACCOUNT } from "../../cadence/transactions";

class Admin extends Nullstack {
  data = {};
  user = {};
  loading = false;

  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  initiate() {
    this.user = getUser();
    this.data = {
      address: this.user.addr,
      price: 0,
    };
  }

  handleChange({ field }) {
    return ({ event }) => {
      event.preventDefault();
      this.data[field] = event.target.value;
    };
  }

  async mintAndSend() {
    try {
      await this.executeMintTrx();
    } catch (err) {
      alert(err.message || "Oops, something went wrong");
    }
  }

  async executeMintTrx() {
    const amount = parseFloat(this.data.price).toFixed(1).toString();
    const address = this.data.address;

    this.loading = true;
    const transactionId = await fcl.mutate({
      cadence: MINT_TOKENS,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
      args: (arg, t) => [arg(amount, t.UFix64), arg(address, t.Address)],
    });

    fcl.tx(transactionId).subscribe((res) => {
      if (res.status === 4) {
        alert(res.errorMessage || "TAP Token Minted");
        this.loading = false;
      }
    });
  }

  async setupAccount() {
    try {
      await this.executeSetupAccountTrx();
    } catch (err) {
      alert(err.message || "Oops, something went wrong");
    }
  }

  async executeSetupAccountTrx() {
    const address = this.data.address;
    console.log({ address });

    this.loading = true;
    const transactionId = await fcl.mutate({
      cadence: SETUP_ACCOUNT,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
      args: (arg, t) => [arg(address, t.Address)],
    });

    fcl.tx(transactionId).subscribe((res) => {
      console.log({ res });
      if (res.status === 4) {
        alert(res.errorMessage || "Account set up");
        this.loading = false;
      }
    });

    // 0xc5531baf74dc0626 ae.studio
    // 0x1a5abf28cd91ef1f +1
  }

  render() {
    return (
      <>
        <NavHeader />
        <main class="admin">
          <aside>
            <ButtonLink linkPath="/admin/create">Create NFT</ButtonLink>
          </aside>
          <div class="faucet">
            <img src="/faucet.svg" alt="" />
            <form class="form" action="submit">
              <Input placeholder="address" bind={this.data.address} />
              <Input placeholder="taps" type="number" bind={this.data.price} />
              <Button
                className="btn-pink"
                onclick={this.mintAndSend}
                disable={this.loading}
              >
                {this.loading ? "Loading" : "Mint and send"}
              </Button>
              <Button onclick={this.setupAccount} disable={this.loading}>
                {this.loading ? "Loading" : "Set Up Account"}
              </Button>
            </form>
          </div>
        </main>
      </>
    );
  }
}

export default Admin;
