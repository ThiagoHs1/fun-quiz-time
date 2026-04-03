interface TimerCircleProps {
  timeLeft: number;
  totalTime: number;
}

export default function TimerCircle({ timeLeft, totalTime }: TimerCircleProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  const color =
    timeLeft <= 5
      ? "hsl(0, 72%, 51%)"
      : timeLeft <= 10
      ? "hsl(38, 92%, 50%)"
      : "hsl(142, 71%, 45%)";

  const isPulsing = timeLeft <= 5;

  return (
    <div className={`relative flex items-center justify-center ${isPulsing ? "animate-pulse-ring" : ""}`}>
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="4"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 linear"
        />
      </svg>
      <span
        className="absolute text-lg font-bold tabular-nums"
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}
