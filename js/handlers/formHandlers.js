export const addFormHandlers = (onSubmit, isAuth, userName) => {
  if (!isAuth) return;

  const nameInput = document.querySelector(".add-form-name");
  nameInput.value = userName;
  nameInput.readOnly = true;

  // Остальная логика обработки формы
};
