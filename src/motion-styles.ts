import { css } from "lit";

export const motionStyles = css`
  .chrome {
    display: none;
  }

  .panel {
    background: linear-gradient(180deg, rgba(8, 17, 32, 0.94), rgba(8, 17, 32, 0.98));
    border-color: var(--panel-border-accent, rgba(255, 255, 255, 0.2));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.07),
      0 0 calc(1px + var(--panel-intensity, 0.4) * 2.5px) var(--panel-glow-accent, transparent);
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }

  .panel::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background:
      radial-gradient(circle at 70% 78%, var(--panel-fill-accent, transparent) 0%, transparent 62%),
      radial-gradient(
        circle at 36% 62%,
        color-mix(in srgb, var(--panel-fill-accent, transparent) 65%, transparent) 0%,
        transparent 58%
      );
    opacity: 1;
    filter: blur(1.5px);
  }

  .panel::before {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 36%);
    opacity: 0.42;
  }

  .panel:hover {
    transform: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.09),
      0 0 calc(2px + var(--panel-intensity, 0.4) * 3.5px) var(--panel-glow-accent, transparent);
  }

  .panel.hidden-slot {
    background: linear-gradient(180deg, rgba(10, 17, 29, 0.78), rgba(7, 12, 21, 0.82));
    border-color: rgba(255, 255, 255, 0.18) !important;
    box-shadow: none;
  }

  ha-card[data-spv-theme="light"] .panel {
    background: linear-gradient(180deg, rgba(251, 254, 255, 0.96), rgba(230, 240, 249, 0.98));
    border-color: var(--panel-border-accent, rgba(45, 67, 90, 0.24));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 0 calc(1px + var(--panel-intensity, 0.4) * 2px) var(--panel-glow-accent, transparent);
  }

  ha-card[data-spv-theme="light"] .panel::before {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent 38%);
    opacity: 0.36;
  }

  ha-card[data-spv-theme="light"] .panel::after {
    background:
      radial-gradient(circle at 70% 78%, var(--panel-fill-accent, transparent) 0%, transparent 64%),
      radial-gradient(
        circle at 36% 62%,
        color-mix(in srgb, var(--panel-fill-accent, transparent) 48%, transparent) 0%,
        transparent 58%
      );
    filter: blur(1px);
    opacity: 0.72;
  }

  ha-card[data-spv-theme="light"] .panel:hover {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.94),
      0 0 calc(2px + var(--panel-intensity, 0.4) * 3px) var(--panel-glow-accent, transparent);
  }

  ha-card[data-spv-theme="light"] .panel.hidden-slot {
    background: linear-gradient(180deg, rgba(238, 246, 252, 0.72), rgba(222, 234, 244, 0.82));
    border-color: rgba(58, 80, 104, 0.32) !important;
  }

  ha-card[data-spv-theme="light"] .spv-motion-backbone {
    stroke: rgba(74, 171, 204, 0.78);
    stroke-width: 3.1;
    opacity: calc(var(--spv-motion-opacity, 0.18) * 2.25 + 0.34);
    mix-blend-mode: normal;
    filter:
      drop-shadow(0 1px 0 rgba(255, 255, 255, 0.72))
      drop-shadow(0 0 2px rgba(74, 171, 204, 0.24));
  }

  ha-card[data-spv-theme="light"] .spv-motion-node {
    fill: rgba(74, 171, 204, 0.78);
    opacity: 0.92;
    mix-blend-mode: normal;
    filter:
      drop-shadow(0 1px 0 rgba(255, 255, 255, 0.75))
      drop-shadow(0 0 2px rgba(74, 171, 204, 0.24));
  }

  :host([data-spv-busbars]) .grid {
    column-gap: 16px;
    row-gap: 22px;
    margin-top: 20px;
  }

  .spv-motion-overlay-svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }

  .spv-motion-flow,
  .spv-motion-backbone {
    fill: none;
    stroke-linejoin: miter;
    pointer-events: none;
  }

  .spv-motion-backbone {
    stroke: color-mix(in srgb, var(--secondary-text-color, #cdd7e4) 82%, white 18%);
    stroke-linecap: butt;
    stroke-width: 2.8;
    opacity: var(--spv-motion-opacity, 0.22);
    mix-blend-mode: screen;
    filter: drop-shadow(
      0 0 2px color-mix(in srgb, var(--secondary-text-color, #cdd7e4) 24%, transparent)
    );
  }

  .spv-motion-node {
    fill: color-mix(in srgb, var(--secondary-text-color, #d7e0eb) 88%, white 12%);
    opacity: var(--spv-motion-opacity, 0.75);
    filter: drop-shadow(
      0 0 2px color-mix(in srgb, var(--secondary-text-color, #d7e0eb) 32%, transparent)
    );
  }

  .spv-motion-node.is-socket-impact {
    animation: spv-socket-impact 900ms ease-out;
  }

  .spv-motion-flow {
    stroke-linecap: round;
    stroke: color-mix(
      in srgb,
      color-mix(in srgb, var(--spv-motion-color, rgba(111, 201, 255, 0.9)) 62%, #ff9d35) 82%,
      #ffd08a
    );
    stroke-width: 8.4;
    stroke-dasharray: 28 2500;
    opacity: var(--spv-motion-opacity, 0.68);
    mix-blend-mode: screen;
    filter:
      drop-shadow(0 0 10px color-mix(in srgb, var(--spv-motion-color) 48%, #ff9d35 52%))
      drop-shadow(0 0 20px color-mix(in srgb, var(--spv-motion-color) 36%, #ffb04e 64%));
    animation: spv-flow-pulse var(--spv-flow-duration, 1800ms) linear;
    animation-delay: var(--spv-flow-delay, 0ms);
    animation-fill-mode: both;
  }

  ha-card[data-spv-theme="light"] .spv-motion-flow {
    stroke: color-mix(
      in srgb,
      color-mix(in srgb, var(--spv-motion-color, #11a36a) 66%, #f59f22) 82%,
      #4f3406
    );
    stroke-width: 9.4;
    opacity: 0.96;
    mix-blend-mode: normal;
    filter:
      drop-shadow(0 0 4px color-mix(in srgb, var(--spv-motion-color, #11a36a) 64%, #f59f22 36%))
      drop-shadow(0 0 10px rgba(138, 91, 12, 0.38))
      drop-shadow(0 1px 0 rgba(255, 255, 255, 0.52));
  }

  .summary-chip.spv-motion-shimmer {
    background-size: 220% 100%, auto, auto;
    animation: spv-shimmer 1100ms cubic-bezier(0.2, 0.85, 0.2, 1);
    background-image:
      linear-gradient(
        112deg,
        transparent 18%,
        rgba(255, 255, 255, 0.14) 46%,
        rgba(255, 255, 255, 0.03) 58%,
        transparent 76%
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.05));
  }

  .summary-chip.spv-motion-power-impact {
    --spv-impact-color: color-mix(
      in srgb,
      var(--spv-shimmer-color, rgba(111, 201, 255, 0.6)) 70%,
      transparent
    );
    animation: spv-alert-ripple 900ms ease-out;
  }

  .summary-chip.spv-motion-neutral-impact {
    --spv-impact-color: rgba(214, 223, 235, 0.36);
    animation: spv-alert-ripple 900ms ease-out;
  }

  .panel.spv-motion-alert-ripple {
    --spv-impact-color: rgba(255, 98, 127, 0.42);
    animation: spv-alert-ripple 900ms ease-out;
  }

  .panel.spv-motion-alert-ripple .status {
    animation: spv-alert-badge 900ms ease-out;
  }

  .panel .inverter-status {
    position: relative;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--spv-text-soft);
  }

  @keyframes spv-flow-pulse {
    0% {
      opacity: var(--spv-motion-opacity, 0.82);
      stroke-dashoffset: 0;
    }
    100% {
      opacity: var(--spv-motion-opacity, 0.82);
      stroke-dashoffset: var(--spv-flow-offset, calc(-1 * var(--spv-flow-travel, 220px)));
    }
  }

  @keyframes spv-shimmer {
    0% {
      background-position: 140% 0, 0 0, 0 0;
    }
    100% {
      background-position: -120% 0, 0 0, 0 0;
    }
  }

  @keyframes spv-socket-impact {
    0% {
      opacity: 0.95;
      transform: scale(1);
      transform-origin: center;
      filter: drop-shadow(0 0 4px color-mix(in srgb, var(--spv-motion-color) 48%, transparent));
    }
    60% {
      opacity: 0.25;
      transform: scale(1.85);
      transform-origin: center;
      filter: drop-shadow(0 0 14px color-mix(in srgb, var(--spv-motion-color) 62%, transparent));
    }
    100% {
      opacity: 0.95;
      transform: scale(1);
      transform-origin: center;
      filter: drop-shadow(0 0 4px color-mix(in srgb, var(--spv-motion-color) 48%, transparent));
    }
  }

  @keyframes spv-alert-ripple {
    0% {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 0 0 var(--spv-impact-color, rgba(255, 98, 127, 0.42)),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }
    55% {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 0 7px color-mix(in srgb, var(--spv-impact-color, rgba(255, 98, 127, 0.42)) 0%, transparent),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }
    100% {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }
  }

  @keyframes spv-alert-badge {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 98, 127, 0.32);
    }
    50% {
      transform: scale(1.045);
      box-shadow: 0 0 0 5px rgba(255, 98, 127, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 98, 127, 0);
    }
  }
`;
