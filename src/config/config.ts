import type z from "zod";

const config = {
  hours: "Our business hours are Monday–Saturday, 9am–7pm.",
  menu: "You can check our menu here: [link]",
  info: {
    instructions: "Good day, type 'info' to see what this bot can do.",
    message: `
        Type 'hours' to view working hours.
        Type 'menu' to view our menu.
    `,
  },
};

export default config;
