import { api } from "../utils/api";

interface LastUpdatedData {
  id: string;
  holders: Date;
  tribes: Date;
  herds: Date;
}

export function useTimeSinceLastUpdate(type: keyof LastUpdatedData) {
  const { data } = api.general.getLastUpdated.useQuery();
  if (!data) return false;

  const lastUpdate = new Date(data[type]);
  // Get the current time
  const currentTime = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentTime.getTime() - lastUpdate.getTime();

  // Convert the time difference to seconds, minutes, hours, etc.
  const seconds = Math.floor(timeDifference / 1000); // Convert to seconds
  const minutes = Math.floor(seconds / 60); // Convert to minutes
  const hours = Math.floor(minutes / 60); // Convert to hours
  const days = Math.floor(hours / 24); // Convert to days

  // You can add more conversions (weeks, months, years) as needed

  // Return the time since last update in a formatted string
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}
