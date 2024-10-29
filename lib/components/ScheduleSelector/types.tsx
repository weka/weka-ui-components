interface DailySchedule {
  days: string
  time: string
}

interface HourlySchedule {
  hours: string
  minuteOffset: number
}

interface MonthlySchedule {
  days: string
  months: string
  time: string
}

interface PeriodicSchedule {
  days: string
  start_time: string
  end_time: string
  interval: number
}

interface WeeklySchedule {
  days: string
  time: string
}

export interface ScheduleData {
  daily: DailySchedule
  hourly: HourlySchedule
  monthly: MonthlySchedule
  periodic: PeriodicSchedule
  weekly: WeeklySchedule
}
