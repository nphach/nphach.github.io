import {
  BIO,
  CURRENT_QUEST,
  PLAYER_STATS,
  SKILLS,
} from "../../content";
import {
  InventoryDetail,
  InventoryDetailSection,
} from "../inventory/InventoryDetail";
import { InventoryHeader } from "../inventory/InventoryHeader";
import { InventoryStatGrid } from "../inventory/InventoryStatGrid";
import { TagList } from "../inventory/TagList";
import { MoodMeters } from "./MoodMeters";

export function AboutPanel() {
  return (
    <>
      <p className="lcdName">nikki phach</p>
      <p className="lcdTagline">software engineer</p>
      <section
        aria-labelledby="profile-heading"
        className="lcdSection lcdInventory lcdProfile"
      >
        <InventoryHeader
          title="player profile"
          titleId="profile-heading"
          subtitle="status · active"
          stats={
            <>
              <span className="lcdInventoryHeaderCounter">v2.0</span>
              <span className="lcdInventoryHeaderCounterLabel">online</span>
            </>
          }
        />

        <MoodMeters />

        <InventoryDetail label="character inspect" labelId="character-inspect-heading">
          <InventoryDetailSection>
            <p className="lcdProjectDescription">{BIO}</p>
            <p className="lcdProfileQuest">
              <span className="lcdProfileQuestLabel">current quest</span>
              {CURRENT_QUEST}
            </p>
          </InventoryDetailSection>
          <InventoryStatGrid stats={PLAYER_STATS} />
          <InventoryDetailSection>
            <TagList tags={SKILLS} label="equipped skills" labelId="skills-heading" />
          </InventoryDetailSection>
        </InventoryDetail>
      </section>
    </>
  );
}
