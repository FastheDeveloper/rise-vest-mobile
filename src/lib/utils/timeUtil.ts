/**
 * Returns a greeting based on the current time of day.
 *
 * @returns {string} A greeting string that corresponds to the time of day.
 */
const getGreeting = (): string => {
  const currentHour = new Date().getHours(); // Get the current hour in 24-hour format.

  // Return a greeting based on the hour of the day.
  if (currentHour < 12) {
    return 'Morning';
  } else if (currentHour < 18) {
    return 'Afternoon';
  } else {
    return 'Evening';
  }
};

/**
 * Represents a transaction object.
 */
interface Transaction {
  inserted: string | number | Date;
  // Add other properties as needed
}

/**
 * Sorts an array of transactions by their insertion date in descending order.
 *
 * @param {Transaction[]} transactions - An array of transaction objects, each with an 'inserted' property.
 * @returns {Transaction[]} The sorted array of transactions.
 */
function sortTransactionsByInsertedDate(transactions: Transaction[]): Transaction[] {
  return transactions.sort((a, b) => {
    const dateA = new Date(a.inserted);
    const dateB = new Date(b.inserted);
    return dateB.getTime() - dateA.getTime(); // Sort in descending order (most recent first)
  });
}

/**
 * Formats a date into a string with the format 'YYYY-MM-DD HH:MM:SS'.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date and time string.
 */
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Return the formatted date and time string.
};

/**
 * Formats a date string into a human-readable format with day suffixes and AM/PM time.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDateDisplay(dateString: string): string {
  // Parse the input date string
  const date = new Date(dateString);

  // Define arrays for month names and suffixes
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Get the day and determine the correct suffix
  const day = date.getDate();
  let suffix: string;
  if (day >= 11 && day <= 13) {
    suffix = 'th';
  } else {
    switch (day % 10) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
    }
  }

  // Format the date components
  const formattedDay = `${day}${suffix}`;
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Format the time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12 for midnight

  // Construct the final formatted string
  return `${formattedDay} ${month}, ${year}`; // Removed extra space before comma
}

export { sortTransactionsByInsertedDate, formatDateTime, getGreeting, formatDateDisplay };
