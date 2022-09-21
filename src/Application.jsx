import Nullstack from "nullstack";
import "./Application.scss";
import Home from "./Home.jsx";

class Application extends Nullstack {
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

  prepare(context) {
    context.page.locale = "en-US";
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
        <Home />
      </body>
    );
  }
}

export default Application;
