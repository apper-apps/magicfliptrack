import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid Date';
  }
};

export const calculateDaysElapsed = (startDate) => {
  if (!startDate) return 0;
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    return differenceInDays(new Date(), start);
  } catch (error) {
    return 0;
  }
};

export const calculateDaysSince = (dateString) => {
  if (!dateString) return 0;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return differenceInDays(new Date(), date);
  } catch (error) {
    return 0;
  }
};

export const isOverdue = (targetDate) => {
  if (!targetDate) return false;
  try {
    const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
    return new Date() > target;
  } catch (error) {
    return false;
  }
};