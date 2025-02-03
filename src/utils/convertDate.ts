import { DateEnum } from './date.enum';

export const convertDate = (
  duration_time: number,
  duration_time_type: DateEnum,
) => {
  const now = new Date();

  switch (duration_time_type) {
    case DateEnum.Hour:
      now.setHours(now.getHours() + duration_time);
      break;
    case DateEnum.Day:
      now.setDate(now.getDate() + duration_time);
      break;
    case DateEnum.Week:
      now.setDate(now.getDate() + duration_time * 7);
      break;
    case DateEnum.Month:
      now.setMonth(now.getMonth() + duration_time);
      break;
    case DateEnum.Year:
      now.setFullYear(now.getFullYear() + duration_time);
      break;
    default:
      throw new Error('Invalid duration time type');
  }

  return now;
};
