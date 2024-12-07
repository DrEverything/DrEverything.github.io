// document.body.innerHTML = "<h1 style='color: red;'>JS LOADED</h1>" + document.body.innerHTML;
let input = document.querySelector("textarea");
input.addEventListener("input", (_) => {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
});
input.addEventListener("keydown", (e) => {
    // if (e.key == "Enter") {
    //   input.disabled = true;
    // }
});
document.addEventListener("keydown", (e) => {
    let element = document.querySelector(".c-container");
    if (e.key == "Q") {
        // element.style.display = "none";
        element.hidden = !element.hidden;
    }
    else if (e.key == "q") {
        // element.style.display = "";
    }
});
