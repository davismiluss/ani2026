const anniversaryConfig = {
  giftHref: "gift/put-gift-file-here.txt",
  steps: [
    {
      answers: ["first place", "our first date", "the cafe"],
      success: "ACCESS GRANTED: origin trace accepted.",
      hint: "ACCESS DENIED: try the place, not the whole story.",
      specificHints: [
        {
          answers: ["home", "house", "apartment"],
          hint: "Close emotionally, wrong coordinate. The system wants the first location.",
        },
        {
          answers: ["school", "university", "college"],
          hint: "Education record detected, but this key is more personal.",
        },
      ],
    },
    {
      answers: ["our song", "perfect", "can't help falling in love"],
      success: "ACCESS GRANTED: audio key matched.",
      hint: "ACCESS DENIED: enter the song title.",
      specificHints: [
        {
          answers: ["shape of you", "ed sheeran"],
          hint: "Artist frequency detected. Narrow it down to the exact track.",
        },
        {
          answers: ["wedding song", "love song"],
          hint: "Category is too broad. The vault needs the title.",
        },
      ],
    },
    {
      answers: ["my love", "love", "baby"],
      success: "ACCESS GRANTED: alias verified.",
      hint: "ACCESS DENIED: think of the name I use all the time.",
      specificHints: [
        {
          answers: ["wife", "ani", "anita"],
          hint: "Identity confirmed, but the alias key is softer than a name.",
        },
        {
          answers: ["darling", "sweetheart"],
          hint: "Correct genre, wrong exact phrase.",
        },
      ],
    },
    {
      answers: ["2022", "twenty twenty two"],
      success: "ACCESS GRANTED: payload unlocked.",
      hint: "ACCESS DENIED: enter the year.",
      specificHints: [
        {
          answers: ["2021", "2023", "2024"],
          hint: "Nearby timestamp detected. Recheck the year the signal started.",
        },
        {
          answers: ["four years", "4 years"],
          hint: "Duration received. Convert the memory into a calendar year.",
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
      feedback.textContent = "ROUTE LOCKED: submit the correct access phrase first.";
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
      revealAction.textContent = isFinalStep ? "Download" : "Next page";
      revealAction.focus();
    }
  });
}

const createLightbox = () => {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Image preview">
      <button class="lightbox__close" type="button" aria-label="Close preview">x</button>
      <div class="lightbox__stage">
        <img alt="" />
      </div>
      <div class="lightbox__controls">
        <button type="button" data-zoom="out">Zoom out</button>
        <button type="button" data-zoom="reset">Reset</button>
        <button type="button" data-zoom="in">Zoom in</button>
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
