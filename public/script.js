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
		var target = elem.currentTarget;

		fetch(`/api/v1/email/validate?email=${encodeURIComponent(email)}`)
				.then(res => res.json())
		    .then(data => {
						validateOutput.innerText = JSON.stringify(data, null, 2);

hideLoader(target)
				})
})


const form = document.getElementById("sendForm");
const btnSend = document.getElementById("btnSend");
const sendOutput = document.getElementById("sendOutput")
const sendPostOutput = document.getElementById("sendPostOutput")


form.addEventListener("submit", (e) => {
	e.preventDefault();
	showLoader(btnSend);

	const formData = new FormData(e.currentTarget);
	const formProps = Object.fromEntries(formData);

	const blob = JSON.stringify({
		from: formProps.fromEmail,
		subject: formProps.subject,
		to: [{
			name: formProps.toEmail.split('@').shift(),
			email: formProps.toEmail,
		}],
		body: {
			type: "html",
			content: formProps.emailBody
		}
	}, null, 2)

	sendPostOutput.innerText = blob

	fetch("/api/v1/email/send", {
		method: "POST",
		headers: {
			"Content-type": "application/json"
		},
		body: blob,
	}).then(res => res.json())
	.then(data => { sendOutput.innerText = JSON.stringify(data, null, 2);
	
hideLoader(btnSend)

	})


	
})

