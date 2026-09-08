import { MOOD_BAR_SEGMENTS } from "../../constants/inventory";
import { PLAYER_MOODS } from "../../content";
import { renderMoodBar } from "../../lib/mood-bar";

export function MoodMeters() {
  return (
    <ul aria-label="Status meters" className="lcdMoodMeters">
      {PLAYER_MOODS.map((mood) => (
        <li key={mood.label} className="lcdMoodMeter">
          <span className="lcdMoodMeterLabel">{mood.label}</span>
          <span
            aria-label={`${mood.label} ${mood.level} out of ${MOOD_BAR_SEGMENTS}`}
            className="lcdMoodMeterBar"
            role="meter"
            aria-valuemax={MOOD_BAR_SEGMENTS}
            aria-valuemin={0}
            aria-valuenow={mood.level}
          >
            {renderMoodBar(mood.level)}
          </span>
        </li>
      ))}
    </ul>
  );
}
