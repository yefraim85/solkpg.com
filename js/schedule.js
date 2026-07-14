const CALENDAR_ID = "25b048d03364a3dba858405bb43cd31585b60685bb86ddbc75f4e22d1663c55a@group.calendar.google.com";
const API_KEY = "AIzaSyAVbve8veGAz3OvsSR5zJbeS9vQAubppAA";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const monthLabel = document.getElementById("scheduleMonthLabel");
const grid = document.getElementById("scheduleGrid");
const prevBtn = document.getElementById("schedulePrev");
const nextBtn = document.getElementById("scheduleNext");

const today = new Date();
let viewMonth = today.getMonth();
let viewYear = today.getFullYear();

async function loadMonth(month, year) {
  monthLabel.textContent = `${MONTHS[month]} ${year}`;
  grid.innerHTML = '<div class="schedule-state"><div class="spinner"></div>Loading events&hellip;</div>';
  try {
    const timeMin = new Date(year, month, 1).toISOString();
    const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=100`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch calendar events");
    const data = await res.json();
    const events = (data.items || []).map((item) => ({
      id: item.id,
      title: item.summary || "Untitled",
      start: new Date(item.start?.dateTime || item.start?.date),
      description: item.description,
      location: item.location,
      allDay: !item.start?.dateTime,
    }));
    renderMonth(month, year, events);
  } catch (err) {
    console.error("Google Calendar fetch error:", err);
    grid.innerHTML = '<div class="schedule-state">Could not load events right now. Please check back soon, or reach out on WhatsApp.</div>';
  }
}

function renderMonth(month, year, events) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  grid.innerHTML = "";
  cells.forEach((day) => {
    const cell = document.createElement("div");
    if (!day) {
      cell.className = "schedule-day is-empty";
      grid.appendChild(cell);
      return;
    }
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    cell.className = "schedule-day" + (isToday ? " is-today" : "");

    const num = document.createElement("span");
    num.className = "date-num";
    num.textContent = day;
    cell.appendChild(num);

    const dayEvents = events.filter((e) => e.start.getDate() === day && e.start.getMonth() === month);
    dayEvents.slice(0, 2).forEach((ev, i) => {
      const chip = document.createElement("div");
      chip.className = `schedule-event chip-${i % 3}`;
      chip.title = [ev.title, ev.location, ev.description].filter(Boolean).join(" — ");
      const time = ev.allDay ? "All day" : ev.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const titleEl = document.createElement("span");
      titleEl.className = "title";
      titleEl.textContent = ev.title;
      const timeEl = document.createElement("span");
      timeEl.className = "time";
      timeEl.textContent = time;
      chip.appendChild(titleEl);
      chip.appendChild(timeEl);
      cell.appendChild(chip);
    });
    if (dayEvents.length > 2) {
      const more = document.createElement("div");
      more.className = "schedule-more";
      more.textContent = `+${dayEvents.length - 2} more`;
      cell.appendChild(more);
    }
    grid.appendChild(cell);
  });
}

prevBtn.addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  loadMonth(viewMonth, viewYear);
});
nextBtn.addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  loadMonth(viewMonth, viewYear);
});

loadMonth(viewMonth, viewYear);
