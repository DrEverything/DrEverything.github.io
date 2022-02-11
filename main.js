const f = (() => {
    // create the svg element
    const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // set width and height
    svg1.setAttribute("width", "100");
    svg1.setAttribute("height", "100");

    // create a circle
    const cir1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
    );
    cir1.setAttribute("cx", "80");
    cir1.setAttribute("cy", "50");
    cir1.setAttribute("r", "30");
    cir1.setAttribute("fill", "red");

    // attach it to the container
    svg1.appendChild(cir1);

    // attach container to document
    document.getElementById("svg54583").appendChild(svg1);
});

f();

const something = document.createElementNS("http://www.w3.org/2000/svg", "svg");

something.setAttribute("height", "400");
something.setAttribute("width", "450");
something.setAttribute("style", "background-color: red");

const path = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
);

path.setAttribute("d", "m 100 350 q 150 -300 300 0");
path.setAttribute("stroke", "blue");
path.setAttribute("stroke-width", "5");
path.setAttribute("fill", "none");

something.appendChild(path);
document.getElementById("good").appendChild(something);
document.getElementById("good").setAttribute("style", "background-color: grey");