import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { form, inputEmail, inputComments } from './elements';
import { sendUserDataApi } from './userDataApi';
import {
  resetAllValidation,
  resetFieldValidation,
  validateEmail,
  validateText,
} from './validationForm';

const STORAGE_KEY = 'formData';

const formData = getFromLocalStorage() || {
  userEmail: '',
  userComments: '',
};

inputEmail.value = formData.userEmail;
inputComments.value = formData.userComments;

form.addEventListener('input', event => {
  resetFieldValidation(event.target);

  const { name, value } = event.target;
  formData[name] = value.trim();
  setToLocalStorage(formData);
});

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  const { userEmail, userComments } = formData;

  const isValidEmail = validateEmail(userEmail);
  const isValidText = validateText(userComments);

  if (!isValidEmail || !isValidText) {
    return;
  }

  try {
    const data = await sendUserDataApi({
      email: userEmail,
      comment: userComments,
    });

    // const { title, message } = data;
    // TODO open modal window (Kate)

    resetData();
  } catch (error) {
    console.log(error.message);

    iziToast.error({
      title: 'Error',
      message: error.message,
      // message: 'Something went wrong',
      position: 'topRight',
    });
  }
}

// helpers
function setToLocalStorage(value, key = STORAGE_KEY) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getFromLocalStorage(key = STORAGE_KEY) {
  return JSON.parse(localStorage.getItem(key));
}

function resetData(key = STORAGE_KEY) {
  localStorage.removeItem(key);
  form.reset();
  resetAllValidation();
  formData.userEmail = '';
  formData.userComments = '';
}
