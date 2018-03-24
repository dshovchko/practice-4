# Практическая работа 4: Асинхронность, Promises, Restful API

## Начало работы

Установите зависимости проекта:

`npm install`

После этого вам будут доступны следующие команды:

 - `npm run lint` - проверка качества вашего кода утилитой ESLint
 - `npm run test [test-file]` - запустить unit-тесты из указанного файла в консоли, например: `npm run test test/spec/task-1.spec.js`
 - `npm run test:all` - запуск всех unit-тестов в консоли
 - `npm run test -- --watch [test-file]`, `npm run test:all -- --watch` - запуск одного или всех unit-тестов в консоли, с автоматическим перезапуском при изменении исходного кода. Например: `npm run test -- --watch test/spec/task-1.spec.js`
 - `npm run test:browser` - запуск всех unit-тестов в браузере
 - `npm run start` - открывает в браузере страничку с необходимой для вашего кода разметкой. При изменении кода страничка автоматически перезагружается.
 
## Задания

### Задача 1
#### Задача 1-1
`window.fetch()` возвращает промис который благополучно разрешится при любом ответе сервера,
даже если сервер вернет ошибку 404, или 500. Отклоняется промис только в случае проблем с сетью:
когда сеть недоступна или сервер вовсе не прислал никакого ответа. Многие считают такое поведение неинтуитивным.

Давайте так посчитаем и мы, и напишем утилиту (middleware) `status(response)` для `window.fetch()`, которая будет проверять
код http-ответа сервера.

Если этот код находится в диапазоне 200-299
(в этом случае поле `ok` ответа будет `true`, см. [Response](https://developer.mozilla.org/en/docs/Web/API/Response)),
то ответ просто передается дальше без изменений.

Если же сервер отвечает с другим кодом, то `status` должен выбросить ошибку `new Error()`
с описанием взятым из поля `Response.statusText`.

```javascript
window.fetch("blahblahblah.com")
  .then(status)
  .then(...)  // <-- должно выполниться если статус ответа сервера 200-299
  .catch(...) // <-- должно выполниться если сервер вернул ошибку
```

#### Задача 1-2
В случае когда сервер возвращает данные в формате `application/json`, тело ответа представляет собой
строку с сериализованными JSON-данными. После получения эти данные нужно преобразовать в настоящий JS-объект.
Напишите утилиту `json(response)` которая парсит полученные данные из формата JSON и возвращает реальный JS-объект.

```javascript
window.fetch("blahblahblah.com")
  .then(json)
  .then(data => {. . .}); // data здесь - это уже десериализованные данные
``` 

#### Задача 1-3
Напишите функцию `getJSON(url)`, которая делает HTTP GET запрос на указанный url,
обрабатывает статус HTTP ответа c помощью `status` и парсит ответ с помощью `json`.

```javascript
getJSON("blahblahblah.com")
  .then(data => { . . .}) // data - уже десериализованные данные
  .catch( . . . );        // сюда попадем если код ответа не равен 200-299
```
 
### Задача 2
Напишите функцию `getParallel(urls)`, которая принимает массив url,
и вызывает их параллельно с помощью `getJSON`.
Функция возвращает промис, который разрешится при выполнении всех вызовов,
или будет отклонен если любой из вызовов получит отказ.

Промис разрешается в массив ответов.

```javascript
getParallel(["url1", "url2", "url3"])
  .then(data => { . . . })   // data - массив из 3 JS-объектов, полученных из JSON-ответов сервера
  .catch( . . . );           // сюда попадем только если хотя бы один из запросов был отклонен
```

### Задача 3
Напишите функцию `getSeries(url1, url2)` которая принимает на вход два url.
Вначале она вызывает с помощью `getJSON` первый url. Если запрос выполнился удачно,
то вызывается второй url.

Функция возвращает промис, который разрешится с массивом из обоих полученных значений.
Например, если первый вызов вернул `"article content"`, а второй `"comments"`,
то результат должен выглядеть как `["article content", "comments"]`.

Кроме того, если первый вызов получит отказ, промис должен быть отклонен со значением
`Error("First fetch failed")`, если второй - отклонен со значением
`Error("Second fetch failed")`.

### Задача 4
Иногда промисы используют для представления выбора пользователя в диалоговых окнах.
(e.g. "Точно ли вы хотите выйти, ведь при выходе вся ваша несохраненная работа будет потеряна, диск отформатирована, а в качестве аватарки в социальной сети установлено фото из паспорта? да/нет")

Мы ожидаем пока пользователь выберет кнопку, поэтому в представлении этого процесса как асинхронной операции есть некоторая логика.
Для реального проекта это не самая хорошая идея, но для учебного задания - вполне.

Напишите функцию `showDialog(dialogId)`, которая показывает диалог с заданным HTML `id`, и возвращает промис.
Промис разрешается если пользователь нажал на кнопку "Yes", отклоняется если пользователь нажал "No".

### Задача 5
Напишите класс `Cart`, (файл task-5/cart-model.js) который представляет корзину покупок (опять!).
Список покупок теперь, однако, будет сохраняться на сервере, и `Cart`
отвечает только за логику связанную с хранением и обработкой списка покупок и общением с сервером.
То есть, он представляет слой Model из схемы MVC.

`Cart` хранит список покупок в виде массива объектов, у каждого из которых есть поля `id`, `name`, `price` и `quantity`.
При добавлении/изменении/удалении позиции из списка покупок `Cart` посылает соответствующий запрос на сервер (набор CRUD-операций).
Изменение массива с покупками происходит только после того, как приходит ответ 200/201/204 от сервера.

Например, если мы добавляем позицию в список покупок, то вначале отправляем запрос `POST /cart/items`, и только
после того как сервер вернул ответ 201 Created, добавлем эту позицию в список покупок.
Если же сервер ответил кодом не из диапазона 200-299, - значит, "произошла чудовищная ошибка" и добавлять позицию в список не нужно.
К вашим услугам вспомогательный метод `Cart::_ajax`, который сделает черновую работу за вас.

<table>
<tr>
    <td>Действие</td>
    <td>Метод `Cart`</td>
    <td>Restful HTTP запрос</td>
    <td>Ответ сервера</td>
</tr>
<tr>
    <td>Загрузить данные с сервера</td>
    <td><code>Cart::load()</code></td>
    <td><code>GET /cart/items</code></td>
    <td>
        <code>200 OK</code><br />
<code>[
    { "id": 1, "name": "Item 1", "price": 15, "quantity": 10 },
    { "id": 19, "name": "Item 19", "price": 3, "quantity": 293 }
]</code>
    </td>
</tr>
<tr>
    <td>Добавить новый пункт</td>
    <td><code>Cart::addItem()</code></td>
    <td>
        <code>POST /cart/items</code><br>
        Тело запроса: <code>{ "id": 1, "name": "Item 1", "price": 15, "quantity": 10 }</code>
    </td>
    <td>
        <code>201 Created</code>
    </td>
</tr>
<tr>
    <td>Изменить пункт</td>
    <td><code>Cart::updateItem()</code></td>
    <td>
        <code>PUT /cart/items/:id</code><br>
        Тело запроса: <code>{ "id": 1, "name": "Item 1", "price": 15, "quantity": 10 }</code>
    </td>
    <td>
        <code>204 No Content</code>
    </td>
</tr>
<tr>
    <td>Удалить пункт</td>
    <td><code>Cart::removeItem()</code></td>
    <td>
        <code>DELETE /cart/items/:id</code>
    </td>
    <td>
        <code>204 No Content</code>
    </td>
</tr>
<tr>
    <td>Очистить корзину</td>
    <td><code>Cart::removeAll()</code></td>
    <td>
        <code>DELETE /cart/items</code>
    </td>
    <td>
        <code>204 No Content</code>
    </td>
</tr>
</table>

Кроме того, есть еще несколько методов, не связанных с изменением списка покупок и не производящих HTTP-запросы.
Их назначение вполне понятно из названий: `getItems()`, `getTotalQuantity()`, `getTotalPrice()`.

Кроме-того-2 `Cart` - модель, которая реализует паттерн "Observer", эта логика уже прописана в классе.
Вам нужно вызывать `Cart::_notify()` каждый раз, когда состояние корзины покупок изменяется, чтобы оповестить подписанные компоненты об изменениях.

Кроме-того-3 в классе есть поле `loading`, которое должно быть `true` пока выполняется HTTP-запрос,
и `false`, если сейчас мы не ожидаем завершения никаких запросов.

Кроме-того-4 при запуске команды `npm run start` вы увидите три компонента (View/Controller/Component/whatever, но я их называю View), подписанных но модель `Cart`.
Два из них выводят данные из `Cart`, каждая свою "проекцию" этих данных.
Третий позволяет вызывать CRUD-методы `Cart` и передавать в них данные, таким образом вы можете проверить работу вашей модели в реальности. 

~~Кроме-того-5~~ ладно, на этом все. Рекомендуемый порядок решения:
1) Реализуйте все методы модели без выполнения HTTP-запросов. Кроме, разумеется, `Cart::load()`, в него можно просто поставить фейковые данные.
2) Добавьте в каждый метод изменяющий состояние модели вызов `this._notify()`, чтобы View знали когда им нужно обновить свое содержимое.
3) Добавьте вызов `Cart::_ajax` для каждого CRUD-метода. `_ajax` возвращает промис, и вам придется пренести код вашего CRUD-метода в `.then()` этого промиса.
4) Добавьте обработку поля `loading` в ваши CRUD-методы. Оно должно быть `true` пока не пришел ответ от сервера, и `false`, если у нас нет текущих запросов.
Обратите внимание на вариант, когда запрос фейлится (например, `DELETE` несуществующей позиции вернет ошибку 404).
5) (\*) По всей вероятности, в ваших CRUD- методах оказалось много дублирующегося "обслуживающего" кода - все эти `this._notify()`, `this.loading = true/false`, обработка ошибок.
Попробуйте вынести весь этот код в метод `_ajax()`.
Возможно, окажется полезным добавить еще один аргумент-функцию `middleware` в метод `_ajax()`.
CRUD-методы тогда могут вызывать метод `_ajax()` и указывать исключительно те действия, которые относятся к конкретному CRUD-методу (фактически, только тот код, что вы написали в пункте 1),
а всю черновую работу выполнит метод `_ajax()` 


### Задача 6 (*)
Напишите класс `EnhancedPromise`, который наследуется от `Promise`, и расширяет его статическим методом `some()`.
Метод принимает первым параметром массив промисов, а вторым параметром число (`count`). 

Метод возвращает промис, который разрешится, если из переданных в массиве промисов разрешилось не менее `count`, или будет отклонен в противном случае.
Если промис разрешился, то возвращается массив из первых `count` ответов (очередность в порядке разрешения).

Промис должен разрешиться сразу же после того, как станет ясен результат: в примере ниже если резолвятся p3 и p1,
то наш промис должен тут же разрешиться с массивом `[(результат p3), (результат p1)]`, не дожидаясь разрешения p2.

Аналогично в случае когда становится ясно что промис должен будет быть отклонен: если в примере ниже отклоняются
p2 и p1, то промис должен быть отклонен, не дожидаясь разрешения p3.

```javascript
EnchancedPromise.some([p1, p2, p3], 2)
.then(data => { . . . })   // data - массив из 2-х первых ответов промисов (в порядке разрешения)
.catch( . . . );           // сюда попадем только если разрешится менее 2-х промисов
```

### Задача 7 (*)
Напишите функцию `getSequential(urls)`, которая принимает массив url, и вызывает их последовательно с помощью `getJSON`. Функция возвращает промис, который разрешится при выполнении всех вызовов, или будет отклонен если любой из вызовов получит отказ.

Промис разрешается в массив ответов.
Если какой-либо из вызовов получает отказ, то промис должен быть отклонен со значением `Error(“failed to fetch ${url}”)`

```javascript
getSequential(["url1", "url2", "url3"])
.then(data => { . . . })   // data - массив из 3 JS-объектов, полученных последовательно из JSON-ответов сервера
.catch( . . . );           // сюда попадем только если хотя бы один из запросов был отклонен
```