document.querySelectorAll("div[contenteditable]").forEach(elem => {
		console.log(elem);
		elem.addEventListener("keydown", (event) => {
				// prevent spaces and newlines
				if ([13, 32].includes(event.keyCode)) {
						event.preventDefault();
				}
		})
})

const validateOutput = document.getElementById("validateOutput");
const validateEmail = document.getElementById("validateEmail");
const btnValidate = document.getElementById("btnValidate");

const showLoader = (elem) => {
		elem.classList.add("btn--disabled");
		elem.innerHTML = `<span class="loader"></span>`;
}

const hideLoader = (elem) => {
		elem.classList.remove("btn--disabled");
		elem.innerHTML = "Fetch";
}

btnValidate.addEventListener("click", (elem) => {
		showLoader(elem.currentTarget);
    const email = validateEmail.innerText.trim();

		fetch(`/api/v1/email/validate?email=${encodeURIComponent(email)}`)
				.then(res => res.json())
		    .then(data => {
						validateOutput.innerText = JSON.stringify(data, null, 2);
				})

						hideLoader(elem.currentTarget);
})
