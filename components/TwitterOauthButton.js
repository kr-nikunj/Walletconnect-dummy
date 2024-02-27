import Image from "next/image";

const TWITTER_CLIENT_ID = "QndhU0FfMUwtX3FkaFhiR0ItYWQ6MTpjaQ" // give your twitter client id here

// twitter oauth Url constructor
function getTwitterOauthUrl() {
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    redirect_uri: "http://www.localhost:3001/oauth/twitter", // client url cannot be http://localhost:3000/ or http://127.0.0.1:3000/
    client_id: TWITTER_CLIENT_ID,
    state: "state",
    response_type: "code",
    scope: ["users.read"].join(" "), // add/remove scopes as needed
  };
  const qs = new URLSearchParams(options).toString();
  return `${rootUrl}?${qs}`;
}

// the component
export function TwitterOauthButton() {
  return (
    <a className="a-button row-container" href={getTwitterOauthUrl()}>
      Twitter
      <p>{" twitter"}</p>
    </a>
  );
}