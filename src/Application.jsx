import Nullstack from "nullstack";
import "../flow/config";
import * as fcl from "@onflow/fcl";
import "./input.css";
import "./Application.css";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminNFT from "./pages/AdminNFT";
import AdminNFTList from "./pages/AdminNFTList";
import { storeUser } from "./utils/user";
import WTF from "./pages/WTF";
import Explore from "./pages/Explore";
import TAPs from "./pages/Taps";
import NFTDetail from "./pages/NFTDetail";
import { GET_BALANCE } from "./cadence/scripts";

class Application extends Nullstack {
  tap = {};
  user = { loggedIn: false };

  static async startProject({ project }) {
    project.name = "Nullstack";
    project.description =
      "Nullstack is a full-stack framework for building web applications with Javascript";
    project.keywords = [
      "nullstack",
      "framework",
      "javascript",
      "web",
      "application",
    ];
  }

  static async getTap({ database }) {
    return database.collection("fts").findOne({ name: "TAP" });
  }

  static async createOrUpdateUser(context) {
    const { user, balance, database } = context;
    const { addr, loggedIn } = user;
    const userDoc = await database.collection("users").findOne({ addr });
    if (userDoc) {
      await database.collection("users").updateOne(
        { addr },
        {
          $set: {
            loggedIn,
            balance,
          },
        }
      );
    } else {
      await database.collection("users").insertOne({ ...user, balance });
    }

    console.log("here");
    const _user = await database.collection("users").findOne({ addr });
    console.log({ _user });
    context.authUser = _user;
    // context.user = currentuser;
    return _user;
  }

  async saveUser(context) {
    const { user } = context;
    let balance = 0;

    if (user.loggedIn) {
      try {
        const result = await fcl.query({
          cadence: GET_BALANCE,
          payer: fcl.authz,
          proposer: fcl.authz,
          authorizations: [fcl.authz],
          args: (arg, t) => [arg(user.addr, t.Address)],
        });

        balance = result;
        console.log({ balance });
        user.balance = balance;
      } catch (error) {
        console.log({ error });
      }
    }

    this.user = await this.createOrUpdateUser({ user, balance });
    context.authUser = this.user;
    await storeUser(this.user);
  }

  prepare(context) {
    console.log({ instances: context.instances });
    context.page.locale = "en-US";
    context.authUser = {};
    fcl.currentUser.subscribe((user) => this.saveUser({ user }));
  }

  async initiate() {
    this.tap = await this.getTap();
  }

  renderHead() {
    return (
      <head>
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
    );
  }

  render() {
    return (
      <body>
        <Head />
        <Home route="/" />
        <WTF route="/wtf" />
        <Explore route="/explore" />
        <TAPs route="/taps" />
        <NFTDetail route="/nft/:id" />
        <Admin route="/admin" />
        <AdminNFT route="/admin/create" />
        <AdminNFTList route="/admin/nfts" />
      </body>
    );
  }
}

export default Application;
