import { type CSSProperties } from "react";
import { Link } from "react-router";
import { INVENTORY_MIN_SLOTS } from "../../constants/inventory";
import { PROJECTS } from "../../content";
import { getWorkPath } from "../../lib/portfolio-route";
import { EmptyInventorySlotIcon, ProjectIcon } from "../../project-icons";
import { PixelIcon } from "../../pixel-icons";
import {
  InventoryDetail,
  InventoryDetailSection,
} from "../inventory/InventoryDetail";
import { InventoryHeader } from "../inventory/InventoryHeader";
import { InventoryStatGrid } from "../inventory/InventoryStatGrid";
import { TagList } from "../inventory/TagList";

type WorkPanelProps = {
  selectedSlug: string | null;
};

export function WorkPanel({ selectedSlug }: WorkPanelProps) {
  const selectedProjectIndex = Math.max(
    0,
    PROJECTS.findIndex((project) => project.slug === selectedSlug),
  );
  const selectedProject = PROJECTS[selectedProjectIndex] ?? PROJECTS[0];
  const inventorySlotCount = Math.max(INVENTORY_MIN_SLOTS, PROJECTS.length);

  return (
    <section
      aria-labelledby="projects-heading"
      className="lcdSection lcdInventory"
    >
      <InventoryHeader
        title="project inventory"
        titleId="projects-heading"
        subtitle={
          <>
            selected · slot{" "}
            {String(selectedProjectIndex + 1).padStart(2, "0")}
          </>
        }
        stats={
          <>
            <span
              aria-label={`${PROJECTS.length} of unlimited collected`}
              className="lcdInventoryHeaderCounter"
            >
              {PROJECTS.length} /{" "}
              <span
                aria-hidden="true"
                className="lcdInventoryHeaderCounterInfinity"
              >
                ∞
              </span>
            </span>
            <span className="lcdInventoryHeaderCounterLabel">collected</span>
          </>
        }
      />

      <ul
        aria-label="Project inventory"
        className="lcdInventoryRow"
        style={
          {
            "--inventory-slots": inventorySlotCount,
          } as CSSProperties
        }
      >
        {PROJECTS.map((project, index) => {
          const selected = selectedProjectIndex === index;

          return (
            <li key={project.slug}>
              <Link
                aria-current={
                  selectedSlug === project.slug ? "page" : undefined
                }
                className={`lcdInventorySlot${selected ? " lcdInventorySlot--selected" : ""}`}
                to={getWorkPath(project.slug)}
              >
                <span className="lcdInventorySlotIndex">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="lcdInventorySlotIcon">
                  <ProjectIcon name={project.icon} />
                </div>
                <span className="lcdInventorySlotName">{project.name}</span>
              </Link>
            </li>
          );
        })}
        {Array.from({
          length: inventorySlotCount - PROJECTS.length,
        }).map((_, index) => (
          <li key={`empty-slot-${index}`} aria-hidden="true">
            <div className="lcdInventorySlot lcdInventorySlot--empty">
              <span className="lcdInventorySlotIndex">
                {String(PROJECTS.length + index + 1).padStart(2, "0")}
              </span>
              <div
                aria-hidden="true"
                className="lcdInventorySlotIcon lcdInventorySlotIcon--empty"
              >
                <EmptyInventorySlotIcon />
              </div>
              <span className="lcdInventorySlotName">???</span>
            </div>
          </li>
        ))}
      </ul>

      <InventoryDetail labelledBy="inventory-detail-heading" label="item inspect">
        <InventoryDetailSection>
          <h3 className="lcdProjectName" id="inventory-detail-heading">
            {selectedProject.name}
          </h3>
          <p className="lcdInventoryMeta">{selectedProject.meta}</p>
        </InventoryDetailSection>
        <InventoryStatGrid
          stats={[
            { label: "type", value: selectedProject.kind },
            { label: "status", value: selectedProject.status },
            { label: "year", value: selectedProject.year },
          ]}
        />
        <InventoryDetailSection>
          <p className="lcdProjectDescription">{selectedProject.description}</p>
        </InventoryDetailSection>
        <InventoryDetailSection>
          <TagList
            tags={selectedProject.tags}
            label="attributes"
            ariaLabel={`${selectedProject.name} tags`}
          />
        </InventoryDetailSection>
        {selectedProject.links.length > 0 ? (
          <InventoryDetailSection>
            <p className="lcdInventoryDetailLabel">links</p>
            <ul className="lcdProjectActionList">
              {selectedProject.links.map((link, index) => (
                <li key={link.label}>
                  <a
                    className={`lcdProjectAction${index === 0 ? " lcdProjectAction--primary" : ""}`}
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <PixelIcon name="externalLink" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </InventoryDetailSection>
        ) : null}
      </InventoryDetail>
    </section>
  );
}
