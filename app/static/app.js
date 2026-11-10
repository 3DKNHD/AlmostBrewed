const state = {
  course: null,
  outline: null,
  progress: { done: [] },
  topic: null,
  tab: {},
  uml: {},
  navOpen: false,
};

function narrowScreen() {
  return window.matchMedia("(max-width: 800px)").matches;
}

function storedNavOpen() {
  try {
    const stored = localStorage.getItem("nav");
    if (stored === "open") return true;
    if (stored === "closed") return false;
  } catch (error) {
    return !narrowScreen();
  }
  return !narrowScreen();
}

state.navOpen = storedNavOpen();

const app = document.querySelector("#app");

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function api(path, body) {
  const options = body
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    : {};
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo completar la petición.");
  return data;
}

function draftKey(topic, exercise, filename) {
  return topic + "/" + exercise + "/" + filename;
}

function loadDraft(topic, exercise, filename, fallback) {
  const key = draftKey(topic, exercise, filename);
  const saved = localStorage.getItem(key);
  return saved === null ? fallback : saved;
}

function saveDraft(topic, exercise, filename, value) {
  localStorage.setItem(draftKey(topic, exercise, filename), value);
}

function selectEditorFile(folder, filename) {
  state.tab[folder] = filename;
  const article = exerciseNode(folder);
  article.querySelectorAll("[data-tab]").forEach((tab) => {
    const on = tab.dataset.file === filename;
    tab.classList.toggle("active", on);
    tab.setAttribute("aria-selected", on ? "true" : "false");
  });
  article.querySelectorAll("[data-editor]").forEach((editor) => {
    editor.hidden = editor.dataset.file !== filename;
  });
}

function visibleEditor(folder) {
  const article = exerciseNode(folder);
  return [...article.querySelectorAll("[data-editor]")].find((node) => !node.hidden) || article.querySelector("[data-editor]");
}

function writeEditor(node, text) {
  node.value = text.replace(/\r\n/g, "\n");
  saveDraft(state.topic.folder, node.dataset.editor, node.dataset.file, node.value);
}

function editorNote(folder, message) {
  const note = exerciseNode(folder).querySelector("[data-editor-note]");
  if (!note) return;
  note.hidden = !message;
  note.textContent = message || "";
}

async function loadJavaFiles(folder, fileList) {
  const editors = [...exerciseNode(folder).querySelectorAll("[data-editor]")];
  const byName = new Map(editors.map((node) => [node.dataset.file.toLowerCase(), node]));
  let shown = null;
  let rejected = false;
  for (const file of fileList) {
    if (!file.name.toLowerCase().endsWith(".java")) {
      rejected = true;
      continue;
    }
    const named = byName.get(file.name.toLowerCase());
    const target = named || (fileList.length === 1 ? (visibleEditor(folder) || editors[0]) : null);
    if (!target) {
      rejected = true;
      continue;
    }
    writeEditor(target, await file.text());
    shown = target;
  }
  if (shown) selectEditorFile(folder, shown.dataset.file);
  if (!shown && editors.length > 1) {
    editorNote(folder, "Este ejercicio espera " + editors.map((node) => node.dataset.file).join(", ") + ".");
  } else if (!shown && rejected) {
    editorNote(folder, "Solo se cargan archivos .java.");
  } else {
    editorNote(folder, "");
  }
}

async function pasteIntoEditor(folder) {
  const editor = visibleEditor(folder);
  if (!editor) return;
  try {
    const text = await navigator.clipboard.readText();
    if (!text.trim()) {
      editor.focus();
      editorNote(folder, "El portapapeles está vacío.");
      return;
    }
    writeEditor(editor, text);
    editorNote(folder, "");
    editor.focus();
  } catch (error) {
    editor.focus();
    editorNote(folder, "No pude leer el portapapeles. Pega con Ctrl+V dentro del editor.");
  }
}

function doneSet() {
  return new Set(state.progress.done || []);
}

function kindLabel(type) {
  if (type === "quiz") return "Pregunta";
  if (type === "uml") return "Diagrama";
  return "Código";
}

function nextTopic() {
  const tracks = (state.outline && state.outline.tracks) || [];
  for (const track of tracks) {
    for (const topic of track.topics) {
      if (topic.done < topic.total) return topic;
    }
  }
  return null;
}

function themeControl() {
  const current = document.documentElement.dataset.theme || "system";
  const options = [["light", "Claro"], ["dark", "Oscuro"], ["system", "Sistema"]];
  return '<div class="theme" role="group" aria-label="Tema">' + options.map((option) => {
    const active = option[0] === current ? " active" : "";
    const pressed = option[0] === current ? "true" : "false";
    return '<button type="button" class="theme-btn' + active + '" data-theme-choice="' + option[0] + '" aria-pressed="' + pressed + '">' + option[1] + "</button>";
  }).join("") + "</div>";
}

function chooseTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  app.querySelectorAll("[data-theme-choice]").forEach((node) => {
    const on = node.dataset.themeChoice === theme;
    node.classList.toggle("active", on);
    node.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function setNav(open) {
  state.navOpen = open;
  try {
    localStorage.setItem("nav", open ? "open" : "closed");
  } catch (error) {
    /* the menu still toggles for this visit */
  }
  const shell = app.querySelector(".shell");
  if (shell) shell.classList.toggle("nav-open", open);
  const sidebar = app.querySelector(".sidebar");
  const slot = app.querySelector(".nav-slot");
  if (sidebar) sidebar.toggleAttribute("inert", !open);
  if (slot) slot.toggleAttribute("inert", open);
  app.querySelectorAll("[data-nav-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
function syncSystemTheme() {
  document.documentElement.dataset.os = themeMedia.matches ? "dark" : "light";
}
themeMedia.addEventListener("change", syncSystemTheme);
syncSystemTheme();

function renderInline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function renderUml(source) {
  const classes = [];
  const relations = [];
  let current = null;
  const relation = /^(\w+)\s+(\*--|o--|-->|<\|--|<\|\.\.)\s+(\w+)\s*$/;
  source.split("\n").forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    const classMatch = /^class\s+(\w+)\s*$/.exec(line);
    if (classMatch) {
      current = { name: classMatch[1], members: [] };
      classes.push(current);
      return;
    }
    const rel = relation.exec(line);
    if (rel) {
      relations.push({ from: rel[1], op: rel[2], to: rel[3] });
      current = null;
      return;
    }
    if (current) current.members.push(line);
  });
  const labels = {
    "*--": "composición",
    "o--": "agregación",
    "-->": "asociación",
    "<|--": "hereda de",
    "<|..": "realiza",
  };
  const boxes = classes.map((item) => {
    const members = item.members.map((member) => "<li>" + esc(member) + "</li>").join("");
    return '<div class="uml-class"><h3>' + esc(item.name) + "</h3><ul>" + members + "</ul></div>";
  }).join("");
  const rels = relations.map((item) => {
    const text = item.op === "<|--" || item.op === "<|.."
      ? item.to + " " + labels[item.op] + " " + item.from
      : item.from + " " + labels[item.op] + " " + item.to;
    return '<p class="uml-rel">' + esc(text) + "</p>";
  }).join("");
  return '<div class="uml">' + boxes + "</div>" + rels;
}

function renderMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const body = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        body.push(lines[i]);
        i += 1;
      }
      const text = body.join("\n");
      html += lang === "uml" ? renderUml(text) : "<pre><code>" + esc(text) + "</code></pre>";
      i += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      html += "<h3>" + renderInline(line.slice(4)) + "</h3>";
    } else if (line.startsWith("## ")) {
      html += "<h2>" + renderInline(line.slice(3)) + "</h2>";
    } else if (line.startsWith("# ")) {
      html += "<h2>" + renderInline(line.slice(2)) + "</h2>";
    } else if (line.startsWith("> ")) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2));
        i += 1;
      }
      html += "<blockquote><p>" + renderInline(quote.join(" ")) + "</p></blockquote>";
      continue;
    } else if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push("<li>" + renderInline(lines[i].slice(2)) + "</li>");
        i += 1;
      }
      html += "<ul>" + items.join("") + "</ul>";
      continue;
    } else if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push("<li>" + renderInline(lines[i].replace(/^\d+\. /, "")) + "</li>");
        i += 1;
      }
      html += "<ol>" + items.join("") + "</ol>";
      continue;
    } else if (line.trim() === "") {
      html += "";
    } else {
      html += "<p>" + renderInline(line) + "</p>";
    }
    i += 1;
  }
  return html;
}

function trackTitle(trackId) {
  const track = (state.course.tracks || []).find((item) => item.id === trackId);
  return track ? track.title : trackId;
}

function renderSidebar() {
  const tracks = (state.outline && state.outline.tracks) || [];
  const current = state.topic && state.topic.folder;
  const blocks = tracks.map((track) => {
    const topics = track.topics.map((topic) => {
      const active = topic.folder === current ? " active" : "";
      const currentAttr = topic.folder === current ? ' aria-current="page"' : "";
      return '<button class="topic-btn' + active + '" data-topic="' + esc(topic.folder) + '"' + currentAttr + ">" +
        '<span class="topic-name">' + esc(topic.title) + '</span><span class="tally">' + topic.done + "/" + topic.total + "</span></button>";
    }).join("");
    return '<p class="track-title">' + esc(track.title) + "</p>" + topics;
  }).join("");
  return '<aside class="sidebar"' + (state.navOpen ? "" : " inert") + '><div class="sidebar-body"><div class="sidebar-top"><p class="brand">' + esc(state.course.title) + "</p>" +
    '<button type="button" class="nav-hide" data-nav-toggle aria-label="Cerrar menú"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.2 3.2l9.6 9.6M12.8 3.2L3.2 12.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></div>' +
    '<p class="tagline">' + esc(state.course.tagline) + "</p>" +
    themeControl() +
    '<button class="home-btn" data-home="1">Inicio</button><nav>' + blocks + "</nav></div></aside>";
}

function renderHome() {
  const tracks = (state.outline && state.outline.tracks) || [];
  const upcoming = nextTopic();
  const next = upcoming
    ? '<p class="next-step"><button class="primary" data-topic="' + esc(upcoming.folder) + '">Sigue con ' + esc(upcoming.title) + "</button></p>"
    : '<p class="lede">No queda nada abierto.</p>';
  const blocks = tracks.map((track) => {
    const topics = track.topics.map((topic) =>
      '<button class="topic-link" data-topic="' + esc(topic.folder) + '"><span>' + esc(topic.title) +
      '</span><span class="tally">' + topic.done + "/" + topic.total + "</span></button>"
    ).join("");
    return '<section class="track-block"><h2>' + esc(track.title) + "</h2>" + topics + "</section>";
  }).join("");
  return '<header class="page-head"><h1>' + esc(state.course.title) + "</h1>" +
    '<p class="lede">' + esc(state.course.tagline) + "</p></header>" + next +
    '<div class="reading"><p>Lee la guía. Si hay un diagrama, léelo antes de escribir código. Intenta el ejercicio y pide la solución después, no antes.</p>' +
    "<p>Los de consola se comprueban solos. Los de ventana se abren en el escritorio: la página te dice qué pulsar.</p></div>" + blocks;
}

function fileTabs(exercise) {
  const names = Object.keys(exercise.files);
  if (names.length <= 1) return "";
  const current = state.tab[exercise.folder] || names[0];
  return '<div class="tabs" role="tablist">' + names.map((name) => {
    const active = name === current ? " active" : "";
    const selected = name === current ? "true" : "false";
    return '<button type="button" class="tab' + active + '" role="tab" aria-selected="' + selected + '" data-tab="' + esc(exercise.folder) + '" data-file="' + esc(name) + '">' + esc(name) + "</button>";
  }).join("") + "</div>";
}

function renderExercise(exercise) {
  const done = doneSet().has(exercise.id) ? '<span class="done-mark">Hecho</span>' : "";
  const head = '<div class="exercise-head"><h2>' + esc(exercise.title) + '</h2><p class="meta"><span>' +
    esc(kindLabel(exercise.type)) + "</span>" + done + "</p></div>";
  const statement = '<div class="guide reading">' + renderMarkdown(exercise.statement || "") + "</div>";
  if (exercise.type === "quiz") {
    const choices = (exercise.choices || []).map((choice, index) =>
      '<li><label><input type="radio" name="quiz-' + esc(exercise.folder) + '" value="' + index + '"> ' + esc(choice) + "</label></li>"
    ).join("");
    const question = exercise.question ? "<p><strong>" + esc(exercise.question) + "</strong></p>" : "";
    return '<article class="exercise" data-exercise="' + esc(exercise.folder) + '">' + head + statement + question +
      '<ul class="choices">' + choices + '</ul><div class="row"><button class="primary" data-quiz="' + esc(exercise.folder) + '">Comprobar</button></div><div class="result"></div></article>';
  }
  if (exercise.type === "uml") {
    return '<article class="exercise" data-exercise="' + esc(exercise.folder) + '">' + head + statement +
      '<div class="uml-form"><input data-class-input="' + esc(exercise.folder) + '" placeholder="Nombre de la clase" aria-label="Nombre de la clase">' +
      '<button class="ghost" data-add-class="' + esc(exercise.folder) + '">Agregar clase</button></div>' +
      '<ul class="chips" data-classes="' + esc(exercise.folder) + '"></ul>' +
      '<div class="rel-row"><select data-from="' + esc(exercise.folder) + '" aria-label="Clase de origen"></select>' +
      '<select data-kind="' + esc(exercise.folder) + '" aria-label="Tipo de relación">' +
      '<option value="association">asociación</option><option value="aggregation">agregación</option>' +
      '<option value="composition">composición</option><option value="generalization">generalización</option>' +
      '<option value="realization">realización</option></select>' +
      '<select data-to="' + esc(exercise.folder) + '" aria-label="Clase de destino"></select>' +
      '<button class="ghost" data-add-rel="' + esc(exercise.folder) + '">Agregar relación</button></div>' +
      '<ul class="rel-list" data-rels="' + esc(exercise.folder) + '"></ul>' +
      '<p class="hint">En generalización y realización, el origen es la clase general o la interfaz, y el destino es la específica.</p>' +
      '<div class="row"><button class="primary" data-uml="' + esc(exercise.folder) + '">Comprobar</button></div><div class="result"></div></article>';
  }
  const names = Object.keys(exercise.files);
  const current = state.tab[exercise.folder] || names[0];
  const editors = names.map((name) => {
    const value = loadDraft(state.topic.folder, exercise.folder, name, exercise.files[name]);
    const hidden = name === current ? "" : " hidden";
    return '<textarea data-editor="' + esc(exercise.folder) + '" data-file="' + esc(name) + '"' + hidden + ' spellcheck="false" aria-label="' + esc(name) + '">' + esc(value) + "</textarea>";
  }).join("");
  const tools = '<div class="row editor-tools"><button type="button" class="ghost" data-upload="' + esc(exercise.folder) + '">Subir .java</button>' +
    '<button type="button" class="ghost" data-paste="' + esc(exercise.folder) + '">Pegar código</button>' +
    '<input class="file-input" data-file-input="' + esc(exercise.folder) + '" type="file" accept=".java,text/plain" multiple hidden></div>' +
    '<p class="hint">Pega el código en el recuadro, o sube un .java de tu equipo.</p>' +
    '<p class="editor-note" data-editor-note="' + esc(exercise.folder) + '" hidden></p>';
  return '<article class="exercise" data-exercise="' + esc(exercise.folder) + '">' + head + statement + fileTabs(exercise) + tools + editors +
    '<div class="row"><button class="primary" data-run="' + esc(exercise.folder) + '">Compilar y correr</button>' +
    '<button class="ghost" data-solution="' + esc(exercise.folder) + '">Ver solución</button></div>' +
    '<div class="result"></div><div class="solution"></div></article>';
}

function flatTopics() {
  const tracks = (state.outline && state.outline.tracks) || [];
  return tracks.flatMap((track) => track.topics);
}

function renderTopicSwitch() {
  const list = flatTopics();
  const index = list.findIndex((topic) => topic.folder === state.topic.folder);
  if (index < 0) return "";
  const prev = list[index - 1];
  const next = list[index + 1];
  const prevHtml = prev
    ? '<button type="button" class="topic-step" data-topic="' + esc(prev.folder) + '"><span class="step-label">Anterior</span><span class="step-title">' + esc(prev.title) + "</span></button>"
    : "<span></span>";
  const nextHtml = next
    ? '<button type="button" class="topic-step next" data-topic="' + esc(next.folder) + '"><span class="step-label">Siguiente</span><span class="step-title">' + esc(next.title) + "</span></button>"
    : "<span></span>";
  return '<nav class="topic-switch" aria-label="Cambiar de tema">' + prevHtml + nextHtml + "</nav>";
}

function renderTopic() {
  const topic = state.topic;
  const objectives = (topic.objectives || []).map((item) => "<li>" + esc(item) + "</li>").join("");
  const example = topic.example && topic.example.length
    ? '<div class="row"><button class="ghost" data-example="1">Correr el ejemplo</button></div><div id="example-result"></div>'
    : "";
  const exercises = topic.exercises.map(renderExercise).join("");
  return '<header class="page-head"><h1>' + esc(topic.title) + "</h1>" +
    '<p class="track-name">' + esc(trackTitle(topic.track)) + "</p></header>" +
    '<ul class="objectives reading">' + objectives + "</ul>" +
    '<div class="guide reading">' + renderMarkdown(topic.guide || "") + example + "</div>" + exercises +
    renderTopicSwitch();
}

function render() {
  document.title = state.course.title;
  const main = state.topic ? renderTopic() : renderHome();
  const open = state.navOpen ? " nav-open" : "";
  app.innerHTML = '<div class="shell' + open + '">' + renderSidebar() +
    '<div class="nav-slot"' + (state.navOpen ? " inert" : "") + '><button type="button" class="nav-toggle" data-nav-toggle aria-expanded="' +
    (state.navOpen ? "true" : "false") + '">Temas</button></div>' +
    '<button type="button" class="scrim" data-nav-close aria-label="Cerrar temas"></button>' +
    '<main class="main">' + main + "</main></div>";
  bind();
  if (state.topic) refreshUmlLists();
}

function bind() {
  app.querySelectorAll("[data-home]").forEach((node) => node.addEventListener("click", () => {
    state.topic = null;
    if (narrowScreen()) state.navOpen = false;
    render();
  }));
  app.querySelectorAll("[data-topic]").forEach((node) => node.addEventListener("click", () => {
    if (narrowScreen()) state.navOpen = false;
    openTopic(node.dataset.topic);
  }));
  app.querySelectorAll("[data-nav-toggle]").forEach((node) => node.addEventListener("click", () => setNav(!state.navOpen)));
  app.querySelectorAll("[data-nav-close]").forEach((node) => node.addEventListener("click", () => setNav(false)));
  app.querySelectorAll("[data-theme-choice]").forEach((node) => node.addEventListener("click", () => chooseTheme(node.dataset.themeChoice)));
  app.querySelectorAll("[data-tab]").forEach((node) => node.addEventListener("click", () => {
    const folder = node.dataset.tab;
    const file = node.dataset.file;
    selectEditorFile(folder, file);
  }));
  app.querySelectorAll("[data-editor]").forEach((node) => {
    node.addEventListener("input", () => saveDraft(state.topic.folder, node.dataset.editor, node.dataset.file, node.value));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const start = node.selectionStart;
        node.value = node.value.slice(0, start) + "    " + node.value.slice(node.selectionEnd);
        node.selectionStart = node.selectionEnd = start + 4;
        saveDraft(state.topic.folder, node.dataset.editor, node.dataset.file, node.value);
      }
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        runExercise(node.dataset.editor);
      }
    });
    node.addEventListener("dragover", (event) => {
      if ([...event.dataTransfer.types].includes("Files")) event.preventDefault();
    });
    node.addEventListener("drop", (event) => {
      if (!event.dataTransfer.files || !event.dataTransfer.files.length) return;
      event.preventDefault();
      loadJavaFiles(node.dataset.editor, event.dataTransfer.files);
    });
  });
  app.querySelectorAll("[data-upload]").forEach((node) => node.addEventListener("click", () => {
    const input = exerciseNode(node.dataset.upload).querySelector("[data-file-input]");
    input.value = "";
    input.click();
  }));
  app.querySelectorAll("[data-file-input]").forEach((node) => node.addEventListener("change", () => {
    if (node.files && node.files.length) loadJavaFiles(node.dataset.fileInput, node.files);
  }));
  app.querySelectorAll("[data-paste]").forEach((node) => node.addEventListener("click", () => pasteIntoEditor(node.dataset.paste)));
  app.querySelectorAll("[data-run]").forEach((node) => node.addEventListener("click", () => runExercise(node.dataset.run)));
  app.querySelectorAll("[data-solution]").forEach((node) => node.addEventListener("click", () => showSolution(node.dataset.solution)));
  app.querySelectorAll("[data-quiz]").forEach((node) => node.addEventListener("click", () => gradeQuiz(node.dataset.quiz)));
  app.querySelectorAll("[data-add-class]").forEach((node) => node.addEventListener("click", () => addClass(node.dataset.addClass)));
  app.querySelectorAll("[data-add-rel]").forEach((node) => node.addEventListener("click", () => addRelation(node.dataset.addRel)));
  app.querySelectorAll("[data-uml]").forEach((node) => node.addEventListener("click", () => gradeUml(node.dataset.uml)));
  const example = app.querySelector("[data-example]");
  if (example) example.addEventListener("click", runExample);
}

function updateSidebar() {
  const current = app.querySelector(".sidebar");
  if (!current) return;
  const holder = document.createElement("template");
  holder.innerHTML = renderSidebar();
  current.replaceWith(holder.content.firstElementChild);
  app.querySelectorAll("[data-home]").forEach((node) => node.addEventListener("click", () => {
    state.topic = null;
    if (narrowScreen()) state.navOpen = false;
    render();
  }));
  app.querySelectorAll(".sidebar [data-topic]").forEach((node) => node.addEventListener("click", () => {
    if (narrowScreen()) state.navOpen = false;
    openTopic(node.dataset.topic);
  }));
  app.querySelectorAll(".sidebar [data-theme-choice]").forEach((node) => node.addEventListener("click", () => chooseTheme(node.dataset.themeChoice)));
  app.querySelectorAll(".sidebar [data-nav-toggle]").forEach((node) => node.addEventListener("click", () => setNav(!state.navOpen)));
}

function markExerciseDone(folder) {
  const meta = exerciseNode(folder).querySelector(".meta");
  if (meta && !meta.querySelector(".done-mark")) {
    meta.insertAdjacentHTML("beforeend", '<span class="done-mark">Hecho</span>');
  }
}

function exerciseNode(folder) {
  return app.querySelector('[data-exercise="' + folder + '"]');
}

function showResult(folder, html) {
  const node = exerciseNode(folder).querySelector(".result");
  node.innerHTML = html;
}

async function refreshOutline() {
  state.outline = await api("/api/outline");
  state.progress = await api("/api/progress");
}

async function openTopic(folder) {
  state.topic = await api("/api/topic/" + folder);
  await refreshOutline();
  render();
  window.scrollTo(0, 0);
}

function collectFiles(folder) {
  const files = {};
  exerciseNode(folder).querySelectorAll("[data-editor]").forEach((node) => {
    if (node.dataset.editor === folder) files[node.dataset.file] = node.value;
  });
  return files;
}

function caseReport(result) {
  if (!result.compiled) return '<div class="bad">javac todavía no está de acuerdo.</div><div class="terminal">' + esc(result.compileLog || "") + "</div>";
  if (result.demo) {
    const actual = (result.cases && result.cases[0] && result.cases[0].actual) || "";
    const tone = result.passed ? "ok" : "bad";
    return '<div class="' + tone + '">Ejemplo</div><div class="terminal">' + esc(actual) + "</div>";
  }
  if (result.window) {
    const steps = (result.steps || []).map((step) => "<li>" + esc(step) + "</li>").join("");
    const tone = result.launched ? "ok" : "bad";
    const confirm = result.launched
      ? '<div class="row"><button class="ghost" data-confirm-window>Ya lo comprobé</button></div>'
      : "";
    return '<div class="' + tone + '">' + esc(result.message || "") + "</div><ol>" + steps + "</ol>" + confirm;
  }
  if (result.passed) return '<div class="ok">Compiló. Esta vez sí.</div>';
  const cases = (result.cases || []).map((item, index) => {
    const files = (item.files || []).map((file) => "\nArchivo " + file.name + "\nEsperado:\n" + file.expected + "\nObtuviste:\n" + file.actual).join("");
    return "Caso " + (index + 1) + "\nEsperado:\n" + item.expected + "\nObtuviste:\n" + item.actual + (item.error ? "\n" + item.error : "") + files;
  }).join("\n\n");
  return '<div class="bad">La salida no coincide.</div><div class="terminal">' + esc(cases) + "</div>";
}

async function runExercise(folder) {
  const button = exerciseNode(folder).querySelector("[data-run]");
  button.disabled = true;
  try {
    const result = await api("/api/grade", {
      topic: state.topic.folder,
      exercise: folder,
      files: collectFiles(folder),
    });
    showResult(folder, caseReport(result));
    const confirm = exerciseNode(folder).querySelector("[data-confirm-window]");
    if (confirm) {
      const exercise = state.topic.exercises.find((item) => item.folder === folder);
      confirm.addEventListener("click", async () => {
        await api("/api/progress", { id: exercise.id });
        await refreshOutline();
        updateSidebar();
        markExerciseDone(folder);
        showResult(folder, '<div class="ok">Quedó marcado. La ventana no se comprueba sola: tú viste si cumplía.</div>');
      });
    }
    if (result.passed && !result.window) {
      await refreshOutline();
      updateSidebar();
      markExerciseDone(folder);
    }
  } catch (error) {
    showResult(folder, '<div class="bad">' + esc(error.message) + "</div>");
  } finally {
    button.disabled = false;
  }
}

async function showSolution(folder) {
  const data = await api("/api/solution", { topic: state.topic.folder, exercise: folder });
  const blocks = Object.keys(data.files).map((name) => "<h3>" + esc(name) + "</h3><pre><code>" + esc(data.files[name]) + "</code></pre>").join("");
  exerciseNode(folder).querySelector(".solution").innerHTML = blocks || "<p>Este ejercicio no tiene código de solución.</p>";
}

async function gradeQuiz(folder) {
  const selected = exerciseNode(folder).querySelector("input:checked");
  if (!selected) {
    showResult(folder, '<div class="bad">Elige una respuesta.</div>');
    return;
  }
  const result = await api("/api/grade", { topic: state.topic.folder, exercise: folder, choice: Number(selected.value) });
  const tone = result.passed ? "ok" : "bad";
  const lead = result.passed ? "Correcto." : "No es esa.";
  showResult(folder, '<div class="' + tone + '">' + lead + " " + esc(result.explain || "") + "</div>");
  if (result.passed) {
    await refreshOutline();
    updateSidebar();
    markExerciseDone(folder);
  }
}

function umlState(folder) {
  if (!state.uml[folder]) state.uml[folder] = { classes: [], relations: [] };
  return state.uml[folder];
}

function refreshUmlLists() {
  app.querySelectorAll("[data-classes]").forEach((list) => {
    const folder = list.dataset.classes;
    const model = umlState(folder);
    list.innerHTML = model.classes.map((name) => "<li>" + esc(name) + "</li>").join("");
    const options = model.classes.map((name) => '<option value="' + esc(name) + '">' + esc(name) + "</option>").join("");
    exerciseNode(folder).querySelector("[data-from]").innerHTML = options;
    exerciseNode(folder).querySelector("[data-to]").innerHTML = options;
    const rels = exerciseNode(folder).querySelector("[data-rels]");
    rels.innerHTML = model.relations.map((item) => "<li>" + esc(item.from + " " + item.kind + " " + item.to) + "</li>").join("");
  });
}

function addClass(folder) {
  const input = exerciseNode(folder).querySelector("[data-class-input]");
  const name = input.value.trim();
  if (!name) return;
  const model = umlState(folder);
  if (!model.classes.some((item) => item.toLowerCase() === name.toLowerCase())) model.classes.push(name);
  input.value = "";
  refreshUmlLists();
}

function addRelation(folder) {
  const node = exerciseNode(folder);
  const model = umlState(folder);
  const from = node.querySelector("[data-from]").value;
  const to = node.querySelector("[data-to]").value;
  const kind = node.querySelector("[data-kind]").value;
  if (!from || !to) return;
  model.relations.push({ from, to, kind });
  refreshUmlLists();
}

async function gradeUml(folder) {
  const result = await api("/api/grade", { topic: state.topic.folder, exercise: folder, uml: umlState(folder) });
  if (result.passed) {
    showResult(folder, '<div class="ok">El diagrama coincide.</div>');
    await refreshOutline();
    updateSidebar();
    markExerciseDone(folder);
    return;
  }
  showResult(folder, '<div class="bad">' + esc((result.notes || []).join(" ")) + "</div>");
}

async function runExample() {
  const box = document.querySelector("#example-result");
  box.innerHTML = "<p>Compilando el ejemplo…</p>";
  try {
    const result = await api("/api/example", { topic: state.topic.folder });
    box.innerHTML = caseReport(result);
  } catch (error) {
    box.innerHTML = '<div class="bad">' + esc(error.message) + "</div>";
  }
}

async function boot() {
  try {
    state.course = await api("/api/course");
    await refreshOutline();
    render();
  } catch (error) {
    app.innerHTML = '<main class="main"><div class="bad">' + esc(error.message) + "</div></main>";
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNav(false);
});

boot();
