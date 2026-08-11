const anniversaryConfig = {
  giftHref: "gift/4yeargift.pdf",
  steps: [
    {
      answers: ["sveicu", "Sveicu", "SVEICU"],
      success: "PIEKĻUVE ATĻAUTA: pirmais kods atrasts.",
      hint: "PIEKĻUVE LIEGTA: Ļauj attēlam palīdzēt Tev atrast atbildi.",
      specificHints: [
        {
          answers: ["lapas", "dēlis", "jubilejas", "jubilejas dēlis"],
          hint: "Tā ir atšķirība, bet kāpēc šeit izskatās savādāk?.",
        },
        {
          answers: ["veicus", "cuives", "sevicu", ],
          hint: "Kas tas par vārdu?",
        },
      ]
    },
    {
      answers: ["Manu, manu, MANU"],
      success: "PIEKĻUVE ATĻAUTA: otrais kods atrasts.",
      hint: "PIEKĻUVE LIEGTA: Dienu ir par daudz, gadu par maz.",
      specificHints: [
        {
          answers: ["venonat", "Venonat"],
          hint: "Malacis, atradi vārdu, bet ne atbildi",
        },
        {
          answers: ["48", "48 mēneši"],
          hint: "Kur šādu skaitli vēl vari atrast?",
        },
      ],
    },
    {
      answers: ["milo", "mīļo", "Mīļo", "Milo", "MĪĻO", "MILO"],
      success: "PIEKĻUVE ATĻAUTA: trešais kods atrasts.",
      hint: "PIEKĻUVE LIEGTA: Atbilde nav krāsa",
      specificHints: [
        {
          answers: ["oranža"],
          hint: "Gandrīz vai tuvu.",
        },
      ],
    },
    {
      answers: ["Spindzelite", "Spindzelīte", "spindzelite", "spindzelīte", "spindelīti", "spindzelīt", "Spindzelīt", "spindzelīt"],
      success: "PIEKĻUVE ATĻAUTA: ceturtais kods atrasts.",
      hint: "PIEKĻUVE LIEGTA: Skaitlis nav atbilde, bet tas palīdzēs to atrast.",
      specificHints: [
        {
          answers: ["2022"],
          hint: "Šo Tev būs jāievada kaut kur citur, lai atrastu pareizo atbildi.",
        },
        {
          answers: ["bite"],
          hint: "Tuvu, bet gan jau zini, kas ir pareizā atbilde.",
        },
      ],
    },
  ],
};

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const exactMatch = (answers, value) =>
  answers.some((acceptedAnswer) => normalize(acceptedAnswer) === value);

const getHint = (step, answer) => {
  const specificHint = step.specificHints?.find((hintGroup) =>
    exactMatch(hintGroup.answers, answer),
  );

  return specificHint?.hint || step.hint;
};

const question = document.querySelector("[data-question]");
const giftLink = document.querySelector("[data-gift-link]");

if (giftLink) {
  giftLink.href = anniversaryConfig.giftHref;
}

if (question) {
  const stepIndex = Number(question.dataset.step);
  const step = anniversaryConfig.steps[stepIndex];
  const form = question.querySelector(".unlock-form");
  const input = form.querySelector("input");
  const submitButton = form.querySelector("button");
  const feedback = form.querySelector(".feedback");
  const revealAction = question.querySelector(".reveal-action");
  const isFinalStep = !question.dataset.next;

  if (question.dataset.next && revealAction) {
    revealAction.href = question.dataset.next;
  }

  revealAction?.addEventListener("click", (event) => {
    if (revealAction.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      feedback.textContent = "CEĻŠ SLĒGTS: sākumā ievadi pareizo kodu.";
      input.focus();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const answer = normalize(input.value);
    const isCorrect = exactMatch(step.answers, answer);

    if (!isCorrect) {
      feedback.textContent = getHint(step, answer);
      input.select();
      return;
    }

    question.classList.add("is-complete");
    feedback.textContent = step.success;
    input.disabled = true;
    submitButton.disabled = true;

    if (revealAction) {
      revealAction.classList.remove("button--locked");
      revealAction.classList.add("button--primary");
      revealAction.removeAttribute("aria-disabled");
      revealAction.removeAttribute("tabindex");
      revealAction.textContent = isFinalStep ? "Lejuplādēt" : "Nākamā lapa";
      revealAction.focus();
    }
  });
}

const createLightbox = () => {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Attēla priekšskatījums">
      <button class="lightbox__close" type="button" aria-label="Aizvērt priekšskatījumu">x</button>
      <div class="lightbox__stage">
        <img alt="" />
      </div>
      <div class="lightbox__controls">
        <button type="button" data-zoom="out">Attālināt</button>
        <button type="button" data-zoom="reset">Atiestatīt</button>
        <button type="button" data-zoom="in">Pietuvināt</button>
      </div>
    </div>
  `;
  document.body.append(lightbox);
  return lightbox;
};

const lightbox = document.querySelector(".lightbox") || createLightbox();
const lightboxImage = lightbox.querySelector("img");
const closeLightbox = lightbox.querySelector(".lightbox__close");
let zoom = 1;

const setZoom = (nextZoom) => {
  zoom = Math.min(Math.max(nextZoom, 1), 3);
  lightboxImage.style.transform = `scale(${zoom})`;
};

document.querySelectorAll("[data-lightbox-image]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const image = trigger.querySelector("img");
    lightboxImage.src = trigger.dataset.lightboxImage;
    lightboxImage.alt = image?.alt || "Preview image";
    lightbox.hidden = false;
    setZoom(1);
    closeLightbox.focus();
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.hidden = true;
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.hidden = true;
  }
});

lightbox.querySelectorAll("[data-zoom]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.zoom;

    if (action === "in") {
      setZoom(zoom + 0.25);
    } else if (action === "out") {
      setZoom(zoom - 0.25);
    } else {
      setZoom(1);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    lightbox.hidden = true;
  }
});
