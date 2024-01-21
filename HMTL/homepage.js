function navigateToHomepage() {
    var dropdown = document.getElementById("dropdown");
    var selectedOption = dropdown.options[dropdown.selectedIndex].value;

    switch (selectedOption) {
        case "option1":
            window.location.href = "homepage1.html";
            break;
        case "option2":
            window.location.href = "homepage2.html";
            break;
        case "option3":
            window.location.href = "homepage3.html";
            break;
        default:
            // Handle the default case or add additional cases as needed
    }
}

function toggleProfileEnlargement(element) {
    // Toggle the "enlarged" class on the profile box
    element.classList.toggle("enlarged");
}

function revertEnlargement(element) {
    // Remove the "enlarged" class to revert the enlargement
    element.classList.remove("enlarged");
}

function enlargeProfile(element) {
    // Enlarge the profile only if it is not already enlarged
    if (!element.classList.contains("enlarged")) {
        toggleProfileEnlargement(element);
    } else {
        // Revert the enlargement if the profile is already enlarged
        revertEnlargement(element);
    }
}
