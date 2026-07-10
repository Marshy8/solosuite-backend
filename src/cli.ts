// cli.ts
// Numbered-menu test harness. Each option reads its input from a fixed
// JSON file in cli_input/ instead of prompting field-by-field — edit the
// JSON file to change what gets sent. Run with: node dist/cli.js
import readline from "readline";
import fs from "fs";
import path from "path";
import {
  listUpcomingEvents,
  createEvent,
  deleteEvent,
} from "./services/google_services/googleCalendar.service";
import {
  createTimeOff,
  deleteTimeOff,
} from "./services/scheduling_services/timeOffScheduling.service";
import { TimeOff } from "./types/timeOff.type";

const INPUT_DIR = path.join(__dirname, "cli_input");

function readInput<T>(filename: string): T {
  const filePath = path.join(INPUT_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

const MENU = `
==== Backend Test CLI ====
1) List upcoming calendar events
2) Create a calendar event      (reads cli_input/createEvent.json)
3) Delete a calendar event       (reads cli_input/deleteEvent.json)
4) Create time off               (reads cli_input/createTimeOff.json)
5) Delete time off               (reads cli_input/deleteTimeOff.json)
0) Exit
`;

async function runListUpcomingEvents() {
  const events = await listUpcomingEvents();
  console.log("SUCCESS:", events);
}

async function runCreateEvent() {
  const input = readInput<{
    summary: string;
    startDateTime: string;
    endDateTime: string;
    timeZone: string;
  }>("createEvent.json");

  const created = await createEvent({
    summary: input.summary,
    start: { dateTime: input.startDateTime, timeZone: input.timeZone },
    end: { dateTime: input.endDateTime, timeZone: input.timeZone },
  });

  console.log("SUCCESS:", created);
}

async function runDeleteEvent() {
  const input = readInput<{ eventId: string }>("deleteEvent.json");
  await deleteEvent(input.eventId);
  console.log("SUCCESS: event deleted");
}

async function runCreateTimeOff() {
  const input = readInput<TimeOff>("createTimeOff.json");
  await createTimeOff(input);
  console.log("SUCCESS: time off created");
}

async function runDeleteTimeOff() {
  const input = readInput<{ eventId: string }>("deleteTimeOff.json");
  await deleteTimeOff(input.eventId);
  console.log("SUCCESS: time off deleted");
}

const ACTIONS: Record<string, () => Promise<void>> = {
  "1": runListUpcomingEvents,
  "2": runCreateEvent,
  "3": runDeleteEvent,
  "4": runCreateTimeOff,
  "5": runDeleteTimeOff,
};

async function main() {
  while (true) {
    console.log(MENU);
    const choice = (await ask("Choose an option: ")).trim();

    if (choice === "0") {
      rl.close();
      return;
    }

    const action = ACTIONS[choice];
    if (!action) {
      console.log("FAIL: not a valid option");
      continue;
    }

    try {
      await action();
    } catch (err) {
      console.log("FAIL:", err);
    }
  }
}

main();
