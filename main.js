let numbers = document.getElementsByClassName("number");

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