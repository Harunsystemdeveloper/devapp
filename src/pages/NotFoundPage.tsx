import { Link, useLocation } from "react-router-dom";

NotFoundPage.route = {
  path: '*'
};

export default function NotFoundPage() {
  return <>
    <h2>Sidan kunde ej hittas.</h2>
    <p>
      Denna sida kan för tillfället inte nås.
    </p>
    <p><strong>{useLocation().pathname.slice(1)}</strong></p>
    <p>Please <Link to="/">visit the start page</Link> instead.</p>
  </>;
}