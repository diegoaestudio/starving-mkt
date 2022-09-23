import Nullstack from "nullstack";
import "../flow/config";
import * as fcl from "@onflow/fcl";
import "../dist/output.css";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminNFT from "./pages/AdminNFT";
import AdminNFTList from "./pages/AdminNFTList";
import { storeUser } from "./utils/user";

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

  static async createOrUpdateUser({ user, database }) {
    if (!user.loggedIn) return { loggedIn: false };

    const { addr } = user;
    const userDoc = await database.collection("users").findOne({ addr });
    if (userDoc) return userDoc;

    const newUser = await database.collection("users").insertOne(user);
    return newUser;
  }

  async saveUser(user) {
    this.user = await this.createOrUpdateUser({ user });
    await storeUser(this.user);
  }

  prepare(context) {
    context.page.locale = "en-US";
    fcl.currentUser.subscribe(this.saveUser);
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
        <Admin route="/admin" />
        <AdminNFT route="/admin/create" />
        <AdminNFTList route="/admin/nfts" />
      </body>
    );
  }
}

export default Application;
