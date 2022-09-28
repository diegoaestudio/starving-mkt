import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import Button from "../../components/Button";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import { getUser } from "../../utils/user";
import "./Admin.css";
import { MINT_TOKENS, SETUP_ACCOUNT } from "../../cadence/transactions";
import AdminSideBar from "../../components/AdminSidebar";
import { CHECK_MINT, CHECK_SETUP } from "../../cadence/scripts";

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

  async checkMintTrx({ address }) {
    this.loading = true;
    const trxId = await fcl.query({
      cadence: CHECK_MINT,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      args: (arg, t) => [arg(address, t.Address)],
    });

    const result = await fcl.tx(trxId).onceSealed();
    this.loading = false;
    console.log({ result });
    return result;
  }

  async mintTrx({ address, amount }) {
    this.loading = true;
    const trxId = await fcl.mutate({
      cadence: MINT_TOKENS,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      args: (arg, t) => [arg(amount, t.UFix64), arg(address, t.Address)],
    });

    const result = await fcl.tx(trxId).onceSealed();
    this.loading = false;
    console.log({ result });
    return result;
  }

  async mintAndSend() {
    console.log("minting");

    const address = this.data.address;
    const amount = parseFloat(this.data.price).toFixed(1).toString();

    console.log({ address });
    console.log({ amount });

    try {
      const result = await this.checkMintTrx({ address });
      console.log({ mintResult: result });
    } catch (err) {
      console.log(JSON.stringify(err));
      alert(err.message);
    }

    // try {
    //   const result = await this.mintTrx({ address, amount });
    //   console.log({ finalResult: result });
    // } catch (err) {
    //   console.log(JSON.stringify(err));
    //   alert(err.message);
    // }
  }

  render() {
    return (
      <>
        <NavHeader />
        <main class="admin">
          <AdminSideBar />
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
            </form>
          </div>
        </main>
      </>
    );
  }
}

export default Admin;
