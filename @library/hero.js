import { waitScript, waitForPageLoaded } from "../@global/helpers.js";

function createHeroAnimation() {}

function App() {
  return React.createElement("div", null, "Hello");
}

waitForPageLoaded().then(async () => {
  await waitScript("https://unpkg.com/react@18/umd/react.development.js", true);
  await waitScript(
    "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
    true
  );

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
  console.log("React app rendered");
});
