/**
 * Returns the date of the first day of the current week (Monday).
 */
export const getFirstDayOfCurrentWeek = (): Date => {
  const date = new Date();
  const dayOfWeek = date.getDay();
  const firstDay = new Date(date);
  // Adjust for Sunday (0) to get Monday (1)
  const firstDayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  firstDay.setDate(date.getDate() + firstDayOffset);
  return firstDay;
};

/**
 * Returns the date of the last day of the current week (Sunday).
 */
export const getLastDayOfCurrentWeek = (): Date => {
  const date = new Date();
  const dayOfWeek = date.getDay();
  const lastDay = new Date(date);
  // Adjust for Sunday (0) to get next Sunday (7)
  const lastDayOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  lastDay.setDate(date.getDate() + lastDayOffset);
  return lastDay;
};

/**
 * Returns the date of the first day of the previous week (Monday).
 */
export const getFirstDayOfPreviousWeek = (): Date => {
  const firstDayOfCurrentWeek = getFirstDayOfCurrentWeek();
  const firstDayOfPreviousWeek = new Date(firstDayOfCurrentWeek);
  firstDayOfPreviousWeek.setDate(firstDayOfCurrentWeek.getDate() - 7);
  return firstDayOfPreviousWeek;
};

/**
 * Returns the date of the last day of the previous week (Sunday).
 */
export const getLastDayOfPreviousWeek = (): Date => {
  const lastDayOfCurrentWeek = getLastDayOfCurrentWeek();
  const lastDayOfPreviousWeek = new Date(lastDayOfCurrentWeek);
  lastDayOfPreviousWeek.setDate(lastDayOfCurrentWeek.getDate() - 7);
  return lastDayOfPreviousWeek;
};

/**
 * Returns the date of the first day of the current month.
 */
export const getFirstDayOfCurrentMonth = (): Date => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Returns the date of the last day of the current month.
 */
export const getLastDayOfCurrentMonth = (): Date => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the current month
};

/**
 * Returns the date of the first day of the current year.
 */
export const getFirstDayOfCurrentYear = (): Date => {
  const date = new Date();
  return new Date(date.getFullYear(), 0, 1);
};

/**
 * Returns the date of the last day of the current year.
 */
export const getLastDayOfCurrentYear = (): Date => {
  const date = new Date();
  return new Date(date.getFullYear(), 11, 31); // Last day of December
};