const anniversaryConfig = {
  giftHref: "gift/put-gift-file-here.txt",
  steps: [
    {
      answers: ["first place", "our first date", "the cafe"],
      success: "Yes. The beginning still feels magic.",
      hint: "Try the place, not the full story.",
    },
    {
      answers: ["our song", "perfect", "can't help falling in love"],
      success: "That one will always be ours.",
      hint: "Think of the song title.",
    },
    {
      answers: ["my love", "love", "baby"],
      success: "There it is. One more page.",
      hint: "The name I use when I mean all of it.",
    },
    {
      answers: ["2022", "twenty twenty two"],
      success: "You found the last key. Your gift is ready.",
      hint: "Try the year.",
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

  if (question.dataset.next && revealAction) {
    revealAction.href = question.dataset.next;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const answer = normalize(input.value);
    const isCorrect = step.answers.some((acceptedAnswer) => normalize(acceptedAnswer) === answer);

    if (!isCorrect) {
      feedback.textContent = step.hint;
      input.select();
      return;
    }

    question.classList.add("is-complete");
    feedback.textContent = step.success;
    input.disabled = true;
    submitButton.disabled = true;

    if (revealAction) {
      revealAction.hidden = false;
      revealAction.focus();
    }
  });
}
