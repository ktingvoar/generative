// Dark mode
const darkModeToggle = document.documentElement;

darkModeToggle.addEventListener("dblclick", () => {
    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("darkMode", true);
    } else {
        localStorage.removeItem("darkMode");
    }
});




// SPA logic
const homeContent = document.querySelector(".home-content");
const sketchLinks = document.querySelectorAll(".sketchlink");
const sketchContent = document.querySelector(".sketch-content");
const homeLink = document.querySelector(".home-link");
const codeLink = document.querySelector(".code-link");
const fourOhFourContent = document.querySelector(".fourohfour-content");


const goToSketch = sketch => {
    sketchContent.classList.add("show");
    homeContent.classList.add("hide");

    const month = sketch.substr(2, 2);
    const year = sketch.substr(4, 2);

    const script = document.createElement("script");
    script.src = `sketches/${year}/${month}/${sketch}.js`;
    document.body.appendChild(script);

    codeLink.innerHTML = sketch;
    codeLink.href = `https://github.com/neefrehman/Generative/blob/master/sketches/${year}/${month}/${sketch}.js`;
    document.title = `${sketch} - Generative - Neef Rehman`;
    history.pushState("", `${sketch} - Generative - Neef Rehman`, sketch);
};


const goHome = () => {
    sketchContent.classList.remove("show");
    homeContent.classList.remove("hide");

    remove();
    document.body.removeChild(document.body.lastChild);

    document.title = "Generative - Neef Rehman";
    history.replaceState("", document.title, "/");
};


const goTo404 = () => {
    homeContent.classList.add("hide");
    sketchContent.classList.remove("show");
    fourOhFourContent.classList.add("show");

    document.title = "404 - Generative - Neef Rehman";
};


const getUrlPath = () => location.pathname.split("/").filter(v => v !== "");
let urlPath = getUrlPath();
let linkedSketch = urlPath[urlPath.length - 1];


if (urlPath.length >= 1 && location.protocol != "file:") {
    const linkedSketchButton = document.getElementById(linkedSketch);

    if (linkedSketchButton) {
        goToSketch(linkedSketch);
    } else {
        goTo404();
    }
}


window.addEventListener("popstate", () => {
    urlPath = getUrlPath();
    const newLinkedSketch = urlPath[urlPath.length - 1];

    if (urlPath.length == 0 || newLinkedSketch == linkedSketch) {
        goHome();
    } else {
        goToSketch(newLinkedSketch);
    }

    urlPath = getUrlPath();
    linkedSketch = urlPath[urlPath.length - 1];
});


window.onbeforeunload = () => window.location.reload(true);


sketchLinks.forEach(link => {
    link.innerHTML = link.id;
    link.addEventListener("click", () => goToSketch(link.id));
});


homeLink.addEventListener("click", () => goHome());
