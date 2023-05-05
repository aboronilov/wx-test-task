# Тестовое задание на должность NodeJS разработчика 

**Требования к заданию:**

Приложение представляет собой страницу, на которой могут делать записи любые авторизованные пользователи.

1. Необходимо реализовать регистрацию и авторизацию пользователя, а также проверку JWT-токена при внесении записей на страницу
2. Запись блога содержит:
    1. Дата записи
    2. Сообщение: может содержать как текст, так и медиа
    3. Автор сообщения
3. На странице с записями должна быть реализована пагинация, на каждой странице (пагинации) должно отображаться по 20 записей
4. Автор записи может редактировать или удалять запись
5. Базу данных необходимо заполнить стартовыми записями
6. Необходимо выполнить деплой сервера для публичного доступа
7. Необходимо написать документацию к эндпоинтам (вручную или сгенерировать из кода)

**Можно использовать:**

- База данных может быть PostgreSQL или MongoDB
- Возможность express
- Библиотеки для работы с ORM
- TypeScript (будет плюсом)

**Нельзя использовать:**

- Nuxt.js / Next.js

**Критерии оценки:**

- Работоспособность согласно ТЗ
- Архитектура решения
- Чистота кода
- Удобство проверки

## Использованые технололгии:

* [Typescript](https://www.typescriptlang.org/)
* [NodeJS](https://nodejs.org/en)
* [ExpressJS](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [Cloudinary](https://cloudinary.com/)

# Сервер развернут [здесь](https://wx-test-task.onrender.com/api) 

1) Для регистрации пользователя необходимо отправить POST запрос на endpoint **/auth/register**. Он ожидает получить тело запроса в формате:
```
{
    "email": "johndoe@gmail.com",
    "password": "secret",
    "username": "John"
}
```
Если вернулся ответ с кодом **201**, значит все хорошо. Валидация отработает если:
* Пользователь с таким email уже зарегистрирован
* Не передать минимум одно из полей
* Передать некорректный email

2) Для авторизации пользователя необходимо отправить POST запрос на endpoint **/auth/login**. Он ожидает получить тело запроса в формате:
```
{
    "email": "johndoe@gmail.com",
    "password": "secret"
}
```
Если вернулся ответ с кодом **200**, значит все хорошо. Токены автоматически помещены в Cookies. Валидация отработает если:
* Не передать минимум одно из полей
* Передать неверные credentials 

3) Для получения информации о текущем пользователе нужно отправить GET запрос на endpoint **/auth/me**. Валидация отработает, если вы не авторизованы.

4) Для создания поста необходимо отправить POST запрос на endpoint **/posts**. Он ожидает получить тело запроса в формате (поле **photo** - не обязательное):
```
{
    "title": "Unlocking Android",
    "content": "Unlocking Android: A Developer's Guide provides concise, hands-on instruction for the Android operating system and development tools. This book teaches important architectural concepts in a straightforward writing style and builds on this with practical and useful examples throughout.",
    "photo": "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson.jpg"
}
```
Если все хорошо, Вы получите ответ в формате 
```
{
    "msg": "Post sucessfully created",
    "newPost": {
        "username": "John",
        "title": "Unlocking Android",
        "content": "Unlocking Android: A Developer's Guide provides concise, hands-on instruction for the Android operating system and development tools. This book teaches important architectural concepts in a straightforward writing style and builds on this with practical and useful examples throughout.",
        "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683277714/s07d05tcwsfp2xo9vkdh.jpg",
        "views": 0,
        "author": "6454c45ed799e1dd3dcc94f2",
        "_id": "6454c793d799e1dd3dcc94fc",
        "createdAt": "2023-05-05T09:08:35.065Z",
        "updatedAt": "2023-05-05T09:08:35.065Z",
        "__v": 0
    }
}
```
Если вы указали **photo**, то данное фото перезальется на облачный севрис **Cloudinary** для последующей обработки на Frontend. Дополнительно реализован счетчик просмотров по полю **views** - оно будет увличиваться на 1 при каждом GET запросе к посту. Валидация отработает, если не указаны поля **title** или **content**, либо при отсутствии авторизации

5) Для обновления поста необходимо отправить PUT запрос на endpoint **/posts/:postId**. Тело запроса - аналогично предыдущему пункту (можно указать любое поле или все сразу). Валидаця отработает, если Вы не являетесь автором данного поста.

6) Для получения всех постов необходимо отправить GET запрос на endpoint **/posts?page=1&limit=20**. Если в query param не указать page, по умолчанию подставится значение 1. Аналогично для limit - значение 20. Вернется ответ в формате:
```
{
    "page": 1,
    "limit": 20,
    "posts": [
        {
            "_id": "6454ccd1d799e1dd3dcc951d",
            "username": "John",
            "title": "Node.js in Action",
            "content": "Node.js in Action is an example-driven tutorial that starts at square one and guides you through all the features, techniques, and concepts you'll need to build production-quality Node applications. You'll start by learning how to set up your Node development environment, including loading the community-created extensions. Next, you'll run several simple demonstration programs where you'll learn the basics of a few common types of Node applications. Then you'll dive into asynchronous programming, a model Node leverages to lessen application bottlenecks.",
            "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683279057/alehwg6vaafoxtu2pg2n.jpg",
            "views": 0,
            "author": "6454c45ed799e1dd3dcc94f2",
            "createdAt": "2023-05-05T09:30:57.717Z",
            "updatedAt": "2023-05-05T09:31:57.976Z",
            "__v": 0
        },
        {
            "_id": "6454cb4bd799e1dd3dcc9512",
            "username": "John",
            "title": "Node.js in Action",
            "content": "Node.js in Action is an example-driven tutorial that starts at square one and guides you through all the features, techniques, and concepts you'll need to build production-quality Node applications. You'll start by learning how to set up your Node development environment, including loading the community-created extensions. Next, you'll run several simple demonstration programs where you'll learn the basics of a few common types of Node applications. Then you'll dive into asynchronous programming, a model Node leverages to lessen application bottlenecks.",
            "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683278666/hlwyxx88bayjpylyu2gt.jpg",
            "views": 0,
            "author": "6454c45ed799e1dd3dcc94f2",
            "createdAt": "2023-05-05T09:24:27.279Z",
            "updatedAt": "2023-05-05T09:24:27.279Z",
            "__v": 0
        },
        {
            "_id": "6454cafad799e1dd3dcc950e",
            "username": "John",
            "title": "MongoDB in Action",
            "content": "MongoDB In Action is a comprehensive guide to MongoDB for application developers. The book begins by explaining what makes MongoDB unique and describing its ideal use cases. A series of tutorials designed for MongoDB mastery then leads into detailed examples for leveraging MongoDB in e-commerce, social networking, analytics, and other common applications.",
            "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683278586/jhhp4ruzl8ldzuuuvo8p.jpg",
            "views": 0,
            "author": "6454c45ed799e1dd3dcc94f2",
            "createdAt": "2023-05-05T09:23:06.607Z",
            "updatedAt": "2023-05-05T09:23:06.607Z",
            "__v": 0
        },
        {
            "_id": "6454caa9d799e1dd3dcc950a",
            "username": "John",
            "title": "Collective Intelligence in Action",
            "content": "There's a great deal of wisdom in a crowd, but how do you listen to a thousand people talking at once  Identifying the wants, needs, and knowledge of internet users can be like listening to a mob.    In the Web 2.0 era, leveraging the collective power of user contributions, interactions, and feedback is the key to market dominance. A new category of powerful programming techniques lets you discover the patterns, inter-relationships, and individual profiles   the collective intelligence   locked in the data people leave behind as they surf websites, post blogs, and interact with other users.    Collective Intelligence in Action is a hands-on guidebook for implementing collective-intelligence concepts using Java. It is the first Java-based book to emphasize the underlying algorithms and technical implementation of vital data gathering and mining techniques like analyzing trends, discovering relationships, and making predictions. It provides a pragmatic approach to personalization by combining content-based analysis with collaborative approaches.    This book is for Java developers implementing collective intelligence in real, high-use applications. Following a running example in which you harvest and use information from blogs, you learn to develop software that you can embed in your own applications. The code examples are immediately reusable and give the Java developer a working collective intelligence toolkit.    Along the way, you work with, a number of APIs and open-source toolkits including text analysis and search using Lucene, web-crawling using Nutch, and applying machine learning algorithms using WEKA and the Java Data Mining (JDM) standard.",
            "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683278505/mzzujevpcqnr507yz7yd.jpg",
            "views": 0,
            "author": "6454c45ed799e1dd3dcc94f2",
            "createdAt": "2023-05-05T09:21:45.835Z",
            "updatedAt": "2023-05-05T09:21:45.835Z",
            "__v": 0
        },
        {
            "_id": "6454ca65d799e1dd3dcc9506",
            "username": "John",
            "title": "Flex 3 in Action",
            "content": "New web applications require engaging user-friendly interfaces   and the cooler, the better. With Flex 3, web developers at any skill level can create high-quality, effective, and interactive Rich Internet Applications (RIAs) quickly and easily. Flex removes the complexity barrier from RIA development by offering sophisticated tools and a straightforward programming language so you can focus on what you want to do instead of how to do it. And now that the major components of Flex are free and open-source, the cost barrier is gone, as well!    Flex 3 in Action is an easy-to-follow, hands-on Flex tutorial. Chock-full of examples, this book goes beyond feature coverage and helps you put Flex to work in real day-to-day tasks. You'll quickly master the Flex API and learn to apply the techniques that make your Flex applications stand out from the crowd.    Interesting themes, styles, and skins  It's in there.  Working with databases  You got it.  Interactive forms and validation  You bet.  Charting techniques to help you visualize data  Bam!  The expert authors of Flex 3 in Action have one goal   to help you get down to business with Flex 3. Fast.    Many Flex books are overwhelming to new users   focusing on the complexities of the language and the super-specialized subjects in the Flex eco-system; Flex 3 in Action filters out the noise and dives into the core topics you need every day. Using numerous easy-to-understand examples, Flex 3 in Action gives you a strong foundation that you can build on as the complexity of your projects increases.",
            "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683278436/z6decuieajifjdahntuo.jpg",
            "views": 0,
            "author": "6454c45ed799e1dd3dcc94f2",
            "createdAt": "2023-05-05T09:20:37.221Z",
            "updatedAt": "2023-05-05T09:20:37.221Z",
            "__v": 0
        },
        {
            "_id": "6454ca20d799e1dd3dcc9502",
            "username": "John",
            "title": "Android in Action, Second Edition",
            "content": "Android in Action, Second Edition is a comprehensive tutorial for Android developers. Taking you far beyond \"Hello Android,\" this fast-paced book puts you in the driver's seat as you learn important architectural concepts and implementation strategies. You'll master the SDK, build WebKit apps using HTML 5, and even learn to extend or replace Android's built-in features by building useful and intriguing examples.",
            "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683278368/c0diovhxv9ibvdx0vmuu.jpg",
            "views": 0,
            "author": "6454c45ed799e1dd3dcc94f2",
            "createdAt": "2023-05-05T09:19:28.416Z",
            "updatedAt": "2023-05-05T09:19:28.416Z",
            "__v": 0
        },
        {
            "_id": "6454c793d799e1dd3dcc94fc",
            "username": "John",
            "title": "Unlocking Android",
            "content": "Unlocking Android: A Developer's Guide provides concise, hands-on instruction for the Android operating system and development tools. This book teaches important architectural concepts in a straightforward writing style and builds on this with practical and useful examples throughout.",
            "imgURL": "https://res.cloudinary.com/djij6eiy3/image/upload/v1683277714/s07d05tcwsfp2xo9vkdh.jpg",
            "views": 0,
            "author": "6454c45ed799e1dd3dcc94f2",
            "createdAt": "2023-05-05T09:08:35.065Z",
            "updatedAt": "2023-05-05T09:08:35.065Z",
            "__v": 0
        }
    ]
}
```
Данный endpoint доступен всем пользователям - для него не нужна авторизация

7) Для получения записей авторизованного пользователя необходимо отправить GET запрос на endpoint **/posts/users/me**. Ответ вернется без пагинации.

8) Для просмотра конкретного поста необходимо отправить GET запрос на endpoint **/posts/:postId**. Данный endpoint доступен всем пользователям - для него не нужна авторизация

9) Для удаления конкретного поста необходимо отправить DELETE запрос на endpoint **/posts/:postId**. Валидация отработает, если пользователь не авторизован или не является автором поста.