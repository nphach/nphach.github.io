import { Link } from "react-router";
import { ROUTES } from "../lib/portfolio-route";

export function NotFoundPage() {
  return (
    <main className="notFoundPage">
      <h1>404</h1>
      <p>This page is not in the device memory. Head back to the home screen.</p>
      <Link className="notFoundPageLink" to={ROUTES.home}>
        return home
      </Link>
    </main>
  );
}
