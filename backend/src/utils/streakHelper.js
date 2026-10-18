const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isYesterday = (lastDate, today) => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(lastDate, yesterday);
};

const updateStreak = (user) => {
  const today = new Date();

  if (!user.lastActiveDate) {
    user.currentStreak = 1;
  } else {
    const lastDate = new Date(user.lastActiveDate);

    if (isSameDay(lastDate, today)) {
      // Already counted today, no change
      return user;
    } else if (isYesterday(lastDate, today)) {
      user.currentStreak += 1;
    } else {
      user.currentStreak = 1;
    }
  }

  if (user.currentStreak > user.longestStreak) {
    user.longestStreak = user.currentStreak;
  }

  user.lastActiveDate = today;
  return user;
};

module.exports = { updateStreak };