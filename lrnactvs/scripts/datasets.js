const items = document.querySelectorAll('#items li');
items.forEach(item => {
  console.log('Name:', item.dataset.name);
  console.log('Category:', item.dataset.category);
  console.log('Color:', item.dataset.color);
});
/*Add an event listener when a user clicks on a product, display its details below the list*/
const details = document.createElement('div');
details.id = 'item-details';
document.body.appendChild(details);

items.forEach(item => {
  item.addEventListener('click', () => {
    details.innerHTML = `
      <h2>${item.dataset.name}</h2>
      <p>Category: ${item.dataset.category}</p>
      <p>Color: ${item.dataset.color}</p>
    `;
  });
});
