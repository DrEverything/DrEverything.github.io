// document.body.innerHTML = "<h1 style='color: red;'>JS LOADED</h1>" + document.body.innerHTML;

let input = document.querySelector("textarea") as HTMLTextAreaElement;

input.addEventListener("input", (_: InputEvent) => {
  input.style.height = 'auto';
  input.style.height = `${input.scrollHeight}px`;
})

input.addEventListener("keydown", (e: KeyboardEvent) => {
  // if (e.key == "Enter") {
  //   input.disabled = true;
  // }
})

document.addEventListener("keydown", (e: KeyboardEvent) => {
  let element = document.querySelector(".c-container") as HTMLDivElement;
  if (e.key == "Q") {
    // element.style.display = "none";
    element.hidden = !element.hidden;
  } else if (e.key == "q") {
    // element.style.display = "";
  }
})
