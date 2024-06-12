function calculateShipping() {
    const items = document.querySelectorAll('.item');
    let totalCost = 0;
    let totalWeight = 0;
    let totalPrice = 0;
    let totalItems = 0;
    let error = false;

    items.forEach(item => {
        const weightInput = item.querySelector('.weight');
        const priceInput = item.querySelector('.price');
        const quantity = parseInt(item.querySelector('.quantity').innerText);

        // Проверяем, заполнены ли поля ввода
        if (weightInput.value.trim() !== '' && priceInput.value.trim() !== '') {
            const weight = parseFloat(weightInput.value);
            const price = parseFloat(priceInput.value);

            // Проверяем, чтобы вес и количество были больше или равны 0.01
            if (weight >= 0.01 && price >= 0.01 && quantity >= 1) {
                totalWeight += weight * quantity;
                totalPrice += price * quantity;
                totalItems += quantity;

                const shippingCost = calculateItemShipping(weight, price, quantity);
                totalCost += shippingCost;
            } else {
                // Если введены некорректные значения, выводим сообщение об ошибке
                item.querySelector('.error').innerText = "Ошибка ввода!";
                error = true;
            }
        }
    });

    if (error) return; // Если была ошибка ввода, не продолжаем вычисления

    const currency = document.querySelector('input[name="currency"]:checked').value;
    let totalCostConverted;
    if (currency === 'eur') {
        const euroRateInput = document.getElementById('euroRate').value;
        const euroRate = parseFloat(euroRateInput) || 0.96; // Используем 0.96 по умолчанию, если значение не введено или некорректно
        totalCostConverted = totalCost * euroRate; // Конвертируем стоимость доставки из долларов в евро по курсу
    } else {
        totalCostConverted = totalCost;
    }

    const totalSum = totalPrice + totalCostConverted;

    document.getElementById('total').innerHTML = `
        <p>Вес товаров: ${totalWeight.toFixed(2)} кг</p>
        <p>Цена товаров: ${currency === 'usd' ? '$' : '€'}${totalPrice.toFixed(2)} (${totalItems} шт${totalItems > 1 ? "ук" : "ка"})</p>
        <p>Цена доставки: ${currency === 'usd' ? '$' : '€'}${totalCostConverted.toFixed(2)}</p>
        <p>Общая цена: ${currency === 'usd' ? '$' : '€'}${totalSum.toFixed(2)}</p>
    `;
}

function calculateItemShipping(weight, price, quantity) {
    let shippingCost;
    const baseShipping = 55; // Минимальная стоимость доставки

    // Рассчитываем стоимость доставки в зависимости от условий
    if ((price + (weight * 9)) < 55) {
        shippingCost = baseShipping + (weight * 9) + (price * 0.10);
    } else {
        shippingCost = baseShipping + (weight * 9) + (price * 0.10); // Добавляем 10% от цены
    }

    return shippingCost * quantity; // Умножаем на количество, если товаров больше одного
}


function toggleEuroField() {
    const euroRateField = document.getElementById('euroRate');
    const isEuroSelected = document.getElementById('eur').checked;
    euroRateField.style.display = isEuroSelected ? 'inline-block' : 'none';
    if (!isEuroSelected) {
        euroRateField.value = '';
    }
    updateTotal();
}

function updateTotal() {
    calculateShipping();
}

function addItem() {
    const itemsContainer = document.getElementById('items');
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.innerHTML = `
        <label for="weight">Вес товара (кг):</label>
        <input type="number" class="weight" placeholder="Вес" min="0.01" step="0.01">
        <label for="price">Цена товара ($/€):</label>
        <input type="number" class="price" placeholder="Цена" min="0.01" step="0.01">
        <button class="quantity-btn" onclick="decreaseQuantity(this)">-</button>
        <span class="quantity">1</span>
        <button class="quantity-btn" onclick="increaseQuantity(this)">+</button>
        <button class="delete-btn" onclick="deleteItem(this)">✖</button>
        <span class="error"></span>
    `;
    itemsContainer.appendChild(newItem);
    updateTotal();

    const items = document.querySelectorAll('.item');
    if (items.length > 1) {
        items[items.length - 1].querySelector('.delete-btn').classList.remove('hidden');
    } else {
        newItem.querySelector('.delete-btn').style.display = 'none'; // Скрываем крестик удаления для первого элемента
    }
}

function deleteItem(btn) {
    const items = document.querySelectorAll('.item');
    if (items.length > 1) {
        btn.parentElement.remove();
        updateTotal();
    } else {
        // Ничего не делаем, так как удалять первый товар нельзя
    }
}

function increaseQuantity(btn) {
    const quantityElement = btn.previousElementSibling;
    let quantity = parseInt(quantityElement.innerText);
    quantity++;
    quantityElement.innerText = quantity;
    updateTotal();
}

function decreaseQuantity(btn) {
    const quantityElement = btn.nextElementSibling;
    let quantity = parseInt(quantityElement.innerText);
    if (quantity > 1) {
        quantity--;
        quantityElement.innerText = quantity;
        updateTotal();
    }
}

document.addEventListener('input', updateTotal);
document.addEventListener('DOMContentLoaded', updateTotal);

// Проверка значений при изменении (после завершения ввода)
document.addEventListener('DOMContentLoaded', function() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            if (parseFloat(this.value) < 0.01) {
                this.value = 0.01;
            }
        });
    });
});

document.getElementById("descriptionButton").addEventListener("click", function() {
    const descriptionContainer = document.getElementById("descriptionContainer");
    if (descriptionContainer.classList.contains("hidden")) {
        descriptionContainer.classList.remove("hidden");
        this.textContent = "Скрыть описание";
    } else {
        descriptionContainer.classList.add("hidden");
        this.textContent = "Показать описание";
    }
});

/**/
function convert() {
    const amount = parseFloat(document.getElementById('amount').value);
    const exchangeRate = parseFloat(document.getElementById('exchangeRate').value);

    // Предполагаем, что пользователь вводит сумму в долларах.
    let result = amount * exchangeRate;

    // Округляем результат до ближайшего целого числа
    result = Math.ceil(result);

    // Форматируем число с пробелами между разрядами
    const formattedResult = result.toLocaleString();

    document.getElementById('result').innerText = 'Итого: ' + formattedResult + ' RUB';
}


/**/
function calculateVAT() {
    const price = parseFloat(document.getElementById('price').value);

    const vatExclusivePrice = price / 1.23;
    const vatAmount = Math.ceil(price - vatExclusivePrice);
    const vatAmountHalved = vatAmount / 2;

    document.getElementById('vatAmount').innerHTML = 'VAT итого: ' + vatAmount.toFixed(0) + '<br>Половина VAT: ' + vatAmountHalved.toFixed(0);
}

/**/
function calculate() {
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    const itemWeight = parseFloat(document.getElementById('itemWeight').value);
    const shippingCost = parseFloat(document.getElementById('shippingCost').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (isNaN(itemPrice) || isNaN(itemWeight) || isNaN(shippingCost) || isNaN(quantity)) {
        alert('Пожалуйста, введите числовые значения для всех полей.');
        return;
    }

    const totalItemWeight = itemWeight * quantity; // Общий вес товаров
    const totalShippingCost = (itemWeight * 9 + shippingCost) * quantity; // Цена за перевозку всех товаров

    document.getElementById('totalItemPrice').innerHTML = 'Общая цена товаров: $' + (itemPrice * quantity).toFixed(2);
    document.getElementById('totalShippingCost').innerHTML = 'Цена за перевозку всех товаров: $' + totalShippingCost.toFixed(2);
    document.getElementById('totalWeight').innerHTML = 'Общий вес товаров: ' + totalItemWeight.toFixed(2) + ' кг';
    document.getElementById('totalCost').innerHTML = 'Общая сумма: $' + ((itemPrice * quantity) + totalShippingCost).toFixed(2);
}
