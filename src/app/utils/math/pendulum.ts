type Pendulum = {
  velocity: number;
  angle: number;
  length: number;
  mass: number;
};

/**
 * Calculate angular acceleration for each pendulum in a double pendulum system according to [this
 * equation](https://miro.medium.com/max/1838/1*-Er5S1Oxjkwj9R2M_G-dDA.png)
 *
 * This function will change angles and the acceleration direction to match the HTML canvas's default angle convention
 * and the relative renderization system of this project
 *
 */

export const calculatePendularMotion = (
  pendulum1: Pendulum,
  pendulum2: Pendulum,
  gravity: number
) => {
  const m1 = pendulum1.mass;
  const m2 = pendulum2.mass;

  const l1 = pendulum1.length;
  const l2 = pendulum2.length;

  const o1 = Math.PI - pendulum1.angle;
  const o2 = -pendulum2.angle;

  const o1_dot = pendulum1.velocity;
  const o2_dot = pendulum2.velocity;

  const g = gravity;

  const a1 = -g * (2 * m1 + m2) * Math.sin(o1);
  const b1 = -m2 * g * Math.sin(o1 - 2 * o2);
  const c1 = -2 * Math.sin(o1 - o2) * m2;
  const d1 = o2_dot ** 2 * l2;
  const e1 = o1_dot ** 2 * l1 * Math.cos(o1 - o2);

  const pendulum1AccelerationNumerator = a1 + b1 + c1 * (d1 + e1);

  const pendulum1AccelerationDenominator =
    l1 * (2 * m1 + m2 - m2 * Math.cos(2 * o1 - 2 * o2));

  const pendulum1Acceleration =
    -pendulum1AccelerationNumerator / pendulum1AccelerationDenominator;

  const a2 = 2 * Math.sin(o1 - o2);
  const b2 = o1_dot ** 2 * l1 * (m1 + m2);
  const c2 = g * (m1 + m2) * Math.cos(o1);
  const d2 = o2_dot ** 2 * l2 * m2 * Math.cos(o1 - o2);

  const pendulum2AccelerationNumerator = a2 * (b2 + c2 + d2);

  const pendulum2AccelerationDenominator =
    l2 * (2 * m2 + m2 - m2 * Math.cos(2 * o1 - 2 * o2));

  const pendulum2Acceleration =
    -pendulum2AccelerationNumerator / pendulum2AccelerationDenominator;

  return {
    pendulum1Acceleration,
    pendulum2Acceleration,
  };
};
