let numbers = document.getElementsByClassName("number");
var isPointed = false;

for (i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener("click", function () {
        var currentOperand = document.getElementById("currentOperand");

        if (currentOperand.innerHTML != "0") {
            currentOperand.innerHTML += this.innerText;
        } else {
            currentOperand.innerHTML = this.innerText;
        }
    });
}

document.getElementById("point").addEventListener("click", function () {
    if (isPointed == false) {
        document.getElementById("currentOperand").innerHTML += ".";

        isPointed = true;
    }
});

document.getElementById("allClear").addEventListener("click", function () {
    document.getElementById("currentOperand").innerHTML = "0";
    document.getElementById("previousOperand").innerHTML = "0";

    isPointed = false;
});