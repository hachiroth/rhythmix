import dayjs from "dayjs";

export const formatDuration = (time: number, isMs = false) => {
  if (isNaN(time) || time === Infinity) return "00:00";
  const totalSeconds = isMs ? Math.floor(time / 1000) : Math.floor(time);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const millisecondToSecond = (ms: number) => {
  if (typeof ms !== "number" || isNaN(ms)) return 0;
  return Math.floor(ms / 1000);
};

export const formatTimestamp = (timestamp) => {
  return dayjs(timestamp).format("MM / D,  YYYY");
};

export function updatedWithinOneYear(timestamp) {
  const oneYearAgo = dayjs().subtract(1, "year");
  return dayjs(timestamp).isAfter(oneYearAgo);
}
