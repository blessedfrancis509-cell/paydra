import confetti from 'canvas-confetti';

/**
 * High-energy multi-burst confetti for reaching 100% of a savings goal or completing major milestones.
 */
export const triggerGoalReachedConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Launch from both left and right edges
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffd700']
    });
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffd700']
    });
  }, 250);
};

/**
 * Quick celebratory burst for successful transfers, bill payments, or vault deposits.
 */
export const triggerSuccessConfetti = () => {
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { y: 0.55 },
    colors: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ffd700'],
    zIndex: 9999
  });
};
