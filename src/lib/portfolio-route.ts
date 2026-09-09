import { PROJECTS, type Project } from "../content";
import type { ExpandedSection } from "../types/view";

export const ROUTES = {
  home: "/",
  about: "/about",
  work: "/work",
} as const;

export type PortfolioRoute =
  | { kind: "landing" }
  | { kind: "about" }
  | { kind: "work"; slug: string | null }
  | { kind: "notfound" };

export function getWorkPath(slug?: string | null): string {
  return slug ? `${ROUTES.work}/${slug}` : ROUTES.work;
}

export function getSectionPath(
  section: ExpandedSection,
  workPath: string = ROUTES.work,
) {
  return section === "about" ? ROUTES.about : workPath;
}

export function findProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function parsePortfolioPath(pathname: string): PortfolioRoute {
  const path = normalizePath(pathname);

  if (path === ROUTES.home) {
    return { kind: "landing" };
  }

  if (path === ROUTES.about) {
    return { kind: "about" };
  }

  if (path === ROUTES.work) {
    return { kind: "work", slug: null };
  }

  if (path.startsWith(`${ROUTES.work}/`)) {
    const slug = decodeURIComponent(path.slice(ROUTES.work.length + 1));

    if (!slug.includes("/") && findProjectBySlug(slug)) {
      return { kind: "work", slug };
    }

    return { kind: "notfound" };
  }

  return { kind: "notfound" };
}

export function getDocumentTitle(route: PortfolioRoute) {
  switch (route.kind) {
    case "about":
      return "About · Nikki Phach";
    case "work": {
      if (route.slug) {
        const project = findProjectBySlug(route.slug);

        if (project) {
          return `${project.name} · Nikki Phach`;
        }
      }

      return "Work · Nikki Phach";
    }
    case "notfound":
      return "404 · Nikki Phach";
    default:
      return "Nikki Phach";
  }
}

export function isExpandedRoute(route: PortfolioRoute) {
  return route.kind === "about" || route.kind === "work";
}

function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, "");

  return trimmed === "" ? ROUTES.home : trimmed;
}
