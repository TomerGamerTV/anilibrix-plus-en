[<img src="https://img.shields.io/github/downloads/anilibrix/anilibrix-plus/total.svg">](https://github.com/anilibrix/anilibrix-plus/releases)

<p align="center">
  <a href="#english-version">English</a> | <a href="#russian-version">Русский</a>
</p>

<a name="english-version"></a>

# AniLibrix Unofficial (English Version)

Telegram Chat: https://t.me/anilibrix_plus_chat
Updates Channel: https://t.me/anilibrix_plus

### Anilibria's desktop anime cinema for any of your computers.

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/anilibrix-plus)

![Anilibrix](https://raw.githubusercontent.com/pavloniym/anilibrix/master/.github/assets/anilibrix.png)

### Features of this unofficial version:
*_Items with an arrow are clickable_

*
  <details>
   <summary>Login via VKontakte</summary>

   ![img.png](./assets/img.png)

  </details>
*
  <details>
   <summary>Auto-skip opening</summary>

  ![img.png](./assets/opening-skip.png)
  ![img.png](./assets/opening-skip2.png)

  </details>
*
  <details>
   <summary>Ability to back up viewing data and restore it if necessary on another device; nothing extra required, all linked to the account</summary>

  ![img.png](./assets/snaps.png)

  </details>

*
  <details>
   <summary>Random release button</summary>

  ![img.png](./assets/rand.png)

  </details>

*
  <details>
   <summary>Discord Rich Presence (broadcasts anime viewing activity to Discord)</summary>

  > - Shows the application icon when the app is running, and the poster and information about the currently viewed release:
  >  - Current episode number
  >  - Total number of episodes
  >  - Title
  >  - Link to the release
  >  - Link to the Anilibria website
  >  - Time remaining until the end of the episode
  >    ![img.png](./assets/drpc.png)

   </details>

*
  <details>
   <summary>Set custom API endpoint (Anilibria API server address) and custom static server (for images and posters).</summary>

  > You can choose from a list or enter your own.
  > This can be useful if a server is unavailable or blocked by your provider.
  > ![img.png](./assets/endpoint.png)

  </details>

*
  <details>
   <summary>Added a button in the settings to show the config file in its directory. Useful for transferring viewing data and statistics or making a backup for a new system.</summary>

  > ![img.png](./assets/showconfig.png)

  </details>

*
  <details>
   <summary>Added a feature to move system bar buttons to the right (default is automatic)</summary>

  > ![img.png](./assets/win_buttons.png)

  </details>

*
  <details>
   <summary>Display related releases</summary>

  > ![img.png](./assets/fran.png)

  </details>

*
  <details>
   <summary>Display dates / release titles in the episode list</summary>

  > ![img.png](./assets/dates.png)

  </details>

*
  <details>
   <summary>Sort by popularity in favorites</summary>

  > ![img.png](./assets/fav_pop.png)

  </details>

*
  <details>
   <summary>Added user count in favorites (like a rating)</summary>

  > ![img.png](./assets/fav_rating.png)
  > ![img.png](./assets/last_rating.png)

  </details>

*
  <details>
   <summary>Display status in the release card in favorites</summary>

  > ![img.png](./assets/status.png)

  </details>

*
  <details>
   <summary>Display people who worked on the release</summary>

  > ![img.png](./assets/team.png)

  </details>

*
  <details>
   <summary>Filter notifications by favorites</summary>

  > ![img.png](./assets/notify_fav.png)

  </details>

*
  <details>
   <summary>Persistent progress display in favorites with different colors (depending on progress)</summary>

  > ![img.png](./assets/fav_progress.png)

  </details>

*
  <details>
   <summary>Display torrent list with the ability to open in an external torrent client</summary>

  > ![img.png](./assets/torrents.png)

  </details>

*
  <details>
   <summary>Removed round poster in favor of a full one</summary>

  > ![img.png](./assets/poster.png)

  </details>

*
  <details>
   <summary>Proxy support</summary>

  > [More details](https://github.com/AnimeHaze/anilibrix-plus/releases/tag/v1.4.3-ext.11)
  > ![img.png](./assets/proxy.png) <!-- Assuming proxy.png exists or is similar to poster.png -->

  </details>

*
  <details>
   <summary>Built-in OperaProxy</summary>

  > Github: [OperaProxy](https://github.com/Snawoot/opera-proxy)
  > ![img.png](./assets/operaproxy.png)

  </details>

*
  <details>
   <summary>Added UP button</summary>

   > ![img.png](./assets/up.png)

  </details>

* Fixed a bug with incorrect progress display when series do not start from 1
* Filter by "all statuses" in favorites and all except "in progress"
* Fixed a bug where announcement releases disappeared from favorites
* Fixed a bug where auto-playback did not occur for episode 0
* Save window state (fullscreen, minimized, screen coordinates)
* Volume control increased from 10 to 20 steps
* Support for Rutube releases in the application player (such releases are marked RUTUBE in series)
* If the config file is corrupted, the application starts and resets to the default config (previously, it would stop launching)
* Fix for PC screen sleep/shutdown during anime viewing (I had this issue, the screen would turn off and lock)
* When switching video to the next episode, the video in Picture-in-Picture mode also switches; no need to reopen this mode
* Fewer account logouts as re-authorization attempts are made before de-authorization to update the session ID

#### Anilibria — this is how anime sounds!

### Player Hotkeys

| Key     | Action                                  |
|---------|-----------------------------------------|
| F       | Toggle fullscreen mode                  |
| ←       | Rewind                                  |
| →       | Forward                                 |
| ↑       | Volume up (or mouse wheel)              |
| ↓       | Volume down (or mouse wheel)            |
| space   | Play / Pause                            |

Plus custom keys at your discretion, set in settings for:
- Enabling/disabling auto-skip opening without leaving the player
- Skipping the opening

### Build and Run (English Version)

> Required Node.JS version - **14.18.0**
> Other versions (especially higher) may have problems building native modules
>
> Damn legacy code, easier to rewrite from scratch...

Before running, don't forget to copy and edit the example `.env` file:

``` bash
cp .env.example .env
```

``` bash
# Install and build dependencies
yarn install

# Run with hot reload at localhost:9080
yarn run serve

# Build production version
yarn run build

# Run ESLint --fix for JS/Vue files and components in `src/`
yarn run lint:fix

# Build for all platforms
yarn run release

# Build for MacOS
yarn run release:mac

# Build for Windows
yarn run release:win

# Build for Linux
yarn run release:lin
```

<a name="russian-version"></a>
# AniLibrix Unoffical (Русская версия)

Чат Telegram: https://t.me/anilibrix_plus_chat
Канал с обновлениями: https://t.me/anilibrix_plus

### Десктопный аниме-кинотеатр Анилибрии для любого вашего компьютера.

[![Загрузите из Snap Store](https://snapcraft.io/static/images/badges/ru/snap-store-black.svg)](https://snapcraft.io/anilibrix-plus)

![Anilibrix](https://raw.githubusercontent.com/pavloniym/anilibrix/master/.github/assets/anilibrix.png)

### Особенности не официальной версии (этой):
*_Пункты с стрелочкой кликабельны_

*
  <details>
   <summary>Вход через ВКонтакте</summary>

   ![img.png](./assets/img.png)

  </details>
*
  <details>
   <summary>Авто пропуск опенинга</summary>

  ![img.png](./assets/opening-skip.png)
  ![img.png](./assets/opening-skip2.png)

  </details>
*
  <details>
   <summary>Можно делать резервные копии данных о просмотрах и восстанавливать при необходимости
  на другом устройстве, ничего не требуется, все с привязкой к аккаунту</summary>

  ![img.png](./assets/snaps.png)

  </details>

*
  <details>
   <summary>Кнопка случайного релиза</summary>

  ![img.png](./assets/rand.png)

  </details>

*
  <details>
   <summary>Discord Rich Presence (трансляция активности просмотра аниме в дискорд)</summary>

  > - Показывает иконку приложения когда запущено приложение и постер и информацию о просматриваемом релизе:
  >  - Номер текущей серии
  >  - Общее кол-во серий
  >  - Название
  >  - Ссылка на релиз
  >  - Ссылка на сайт либрии
  >  - Сколько осталось времени до конца серии
  >    ![img.png](./assets/drpc.png)

   </details>

*
  <details>
   <summary>Установка кастомного эндпоинта API (адреса API сервера Anilibria) и
  кастомного сервера статики (для получения картинок и постеров).</summary>

  > Можно выбрать один из списка или же ввести какой-то свой.
  > Может быть удобно если кого-то сервер недоступен и заблокирован провайдером.
  > ![img.png](./assets/endpoint.png)

  </details>

*
  <details>
   <summary>Внизу в настройках появилась возможность нажать на кнопку для показа файла конфига
  в директории, может быть полезно если требуется перенести данные просмотров
  и статистики или сделать резервную копию для переноса на новую систему</summary>

  > ![img.png](./assets/showconfig.png)

  </details>

*
  <details>
   <summary>Добавлена функция для перемещения кнопок системного бара в правую часть
  (по умолчанию расположение автоматическое)</summary>

  > ![img.png](./assets/win_buttons.png)

  </details>

*
  <details>
   <summary>Вывод связанных релизов</summary>

  > ![img.png](./assets/fran.png)

  </details>

*
  <details>
   <summary>Вывод дат / названий выхода в списке эпизодов</summary>

  > ![img.png](./assets/dates.png)

  </details>

*
  <details>
   <summary>Сортировка по популярности в избранном</summary>

  > ![img.png](./assets/fav_pop.png)

  </details>

*
  <details>
   <summary>Добавлено кол-во у пользователей в избранном (типа рейтинг)</summary>

  > ![img.png](./assets/fav_rating.png)
  > ![img.png](./assets/last_rating.png)

  </details>

*
  <details>
   <summary>Вывод статуса в карточке релиза в избранном</summary>

  > ![img.png](./assets/status.png)

  </details>

*
  <details>
   <summary>Вывод людей работавших над релизом</summary>

  > ![img.png](./assets/team.png)

  </details>

*
  <details>
   <summary>Фильтр уведомлений по избранному</summary>

  > ![img.png](./assets/notify_fav.png)

  </details>

*
  <details>
   <summary>Постоянное отображение прогресса в избранном разными цветами (в зависиомсти от прогресса)</summary>

  > ![img.png](./assets/fav_progress.png)

  </details>

*
  <details>
   <summary>Вывод списка торрентов с возможностью открытия в внешнем торрент клиенте</summary>

  > ![img.png](./assets/torrents.png)

  </details>

*
  <details>
   <summary>Убран круглый постер в пользу полного</summary>

  > ![img.png](./assets/poster.png)

  </details>

*
  <details>
   <summary>Поддержка прокси</summary>

  > [Подробнее](https://github.com/AnimeHaze/anilibrix-plus/releases/tag/v1.4.3-ext.11)
  ![img.png](./assets/poster.png)

  </details>

*
  <details>
   <summary>Встроенная OperaProxy</summary>

  > Github: [OperaProxy](https://github.com/Snawoot/opera-proxy)
  > ![img.png](./assets/operaproxy.png)

  </details>

*
  <details>
   <summary>Добавлена кнопка ВВЕРХ</summary>

   > ![img.png](./assets/up.png)

  </details>

* Исправлен баг с неверным отображением прогресса когда серии начинаются не с 1
* Фильтр по "все статусы" в избранном и все кроме "в работе"
* Исправлен баг с пропаданием из избранного релизов-анонсов
* Исправлен баг когда не производилось авто воспроизведение для эпизода 0
* Сохранение состояния окна (фулл скрин, минимизация, кординаты на экране)
* Регулировка громкости увеличена с 10 до 20 делений
* Поддержка rutube релизов в плеере приложения (у таких релизов пометка RUTUBE в сериях)
* При повреждении конфиг файла приложение запускается и
  сбрасывает на конфиг по умолчанию (ранее в таком случае оно переставало запускаться)
* Фикс засыпания / выключения экрана пк при просмотре аниме
  (у меня он был, выключался экран и блокировало)
*  При переключении видео на следующую серию, переключается
   и видео в Picture-in-picture теперь не надо пере открывать этот режим
* Вылетов из аккаунта меньше так как перед деавторизацией делаются попытки
  повторной авторизации для обновления сессионного идентификатора

#### Анилибрия — так звучит аниме!

### Горячие клавиши плеера

| Клавиша | Действие                               |
|---------|----------------------------------------|
| F       | Переключение полноэкранного режима     |
| ←       | Назад                                  |
| →       | Вперед                                 |
| ↑       | Громкость больше (или колесиком мышки) |
| ↓       | Громкость меньше (или колесиком мышки) |
| space   | Воспроизведение / пауза                |

Плюс кастомные клавиши на свое усмотрение которые устанавливаются в настроках для:
- Включения выключени автопропуска опенинга не выходя из плеера
- Пропуска опенинга

### Сборка и запуск (Russian Version)

> Требуемая верси Node.JS - **14.18.0**
> На других версиях (особенно выше) могут быть проблемы со сборкой нативных модулей
>
> Чертов сраный легаси проще переписать с нуля...

Перед запуском не забудьте скопировать и отредактировать пример `.env` файла:

``` bash
cp .env.example .env
```

``` bash
# Установка и сборка зависимостей
yarn install

# Запуск с горячей перезагрузкой на localhost:9080
yarn run serve

# Сборка production версии
yarn run build

# Запуск ESLint --fix для JS/Vue файлов и компонентов в `src/`
yarn run lint:fix

# Сборка под все платформы
yarn run release

# Сборка под MacOS
yarn run release:mac

# Сборка под Windows
yarn run release:win

# Сборка под Linux
yarn run release:lin
```
