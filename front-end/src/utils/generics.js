export const getActiveTime = () => {
  const currentTime = new Date().getTime();
  const openingTime = new Date().setHours(10, 30);
  const closingTime = new Date().setHours(21, 30);

  if (currentTime < openingTime) return openingTime;
  if (currentTime >= openingTime && currentTime <= closingTime)
    return currentTime;
  if (currentTime > closingTime) return closingTime;
};

export const getHourAndMinFromTime = (time) => {
  const timeArray = time.split(":");
  const hour = timeArray[0];
  const min = timeArray[1];
  return { hour, min };
};
