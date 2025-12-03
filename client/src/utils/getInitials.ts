export const getInitials = (name: string) => {
  const names = name.split(' ');
  let initials = names[0].substring(0, 1);
  if (names.length > 1) {
    initials += names[1].substring(0, 1);
  }
  return initials;
};
