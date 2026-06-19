
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const getInitials = (text: string) => {
  if (!text) return '';

  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

export const getFullName = (text: string) => {
    if (!text) return '';
    
    return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
