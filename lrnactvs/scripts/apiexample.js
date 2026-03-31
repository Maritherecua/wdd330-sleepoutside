const fetchDataButton = document.getElementById("fetchData");
const apiResponse = document.getElementById("apiResponse");

fetchDataButton.addEventListener("click", async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1",
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    apiResponse.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    apiResponse.textContent = `Error: ${error.message}`;
  }
});
