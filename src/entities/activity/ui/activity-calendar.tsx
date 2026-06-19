import type { ActivityDay } from "@/entities/activity/model/activity-day";
import { getActivityLevel } from "@/entities/activity/model/activity-level";
import { formatActivityTooltip } from "@/entities/activity/model/activity-tooltip";
import { weekdayOf } from "@/shared/lib/date";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 한 달치 활동을 7열 달력 형식으로 렌더한다. 셀은 컨테이너 폭에 맞춰 채워진다. */
export function ActivityCalendar({ days }: { days: ActivityDay[] }) {
  const firstDay = days[0];
  const leadingBlanks = firstDay ? weekdayOf(firstDay.date) : 0;

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((weekday) => (
        <span key={weekday} className="text-placeholder text-center text-xs">
          {weekday}
        </span>
      ))}
      {Array.from({ length: leadingBlanks }, (_, index) => (
        <span key={`blank-${index}`} aria-hidden />
      ))}
      {days.map((day) => (
        <span
          key={day.date}
          className="text-foreground flex aspect-square items-center justify-center rounded-sm text-xs leading-none"
          data-level={getActivityLevel(day.count)}
          title={formatActivityTooltip(day)}
        >
          {/* {Number(day.date.slice(8, 10))} */}
        </span>
      ))}
    </div>
  );
}
