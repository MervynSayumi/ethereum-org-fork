---
title: Beacon Chain
description: Узнайте о Beacon Chain — обновлении, которое представило Ethereum с доказательством владения (Proof-of-Stake).
lang: ru
template: upgrade
image: /upgrades/core.png
alt: 
summaryPoint1: Сеть Beacon Chain ничего не меняет в том Ethereum, который мы используем сегодня.
summaryPoint2: Она будет координировать работу сети, выступая в качестве уровня консенсуса.
summaryPoint3: Она ввела в экосистему Ethereum доказательство владения.
summaryPoint4: В технических дорожных картах вы могли видеть это под названием «Фаза 0».
---

<UpgradeStatus isShipped dateKey="page-upgrades:page-upgrades-beacon-date">
    Запуск Beacon Chain выполнен 1 декабря 2020 года в полдень (UTC). Чтобы узнать больше, <a href="https://beaconscan. com/">ознакомьтесь с данными</a>. Если вы хотите помочь с проверкой цепочки, вы можете <a href="/staking/">вложить свои ETH</a>.
</UpgradeStatus>

## Что делает Beacon Chain? {#what-does-the-beacon-chain-do}

Beacon Chain будет осуществлять или координировать расширенную сеть [осколков](/roadmap/danksharding/) и [стейкеров](/staking/). Но это не будет похоже на сегодняшнюю [основную сеть Ethereum](/glossary/#mainnet). Она не может работать с аккаунтами или смарт-контрактами.

Роль Beacon Chain со временем изменится, но это основополагающий компонент для [безопасного, устойчивого и масштабируемого Ethereum, над которым мы работаем](/roadmap/vision/).

## Функции Beacon Chain {#beacon-chain-features}

### Введение стейкинга {#introducing-staking}

Beacon Chain вводит [доказательство владения](/developers/docs/consensus-mechanisms/pos/) в Ethereum. Это новый способ обеспечить безопасность работы Ethereum. Он взаимовыгоден для участников, делая Ethereum безопаснее и позволяя получать участникам ETH в процессе. На практике вам придется вложить ETH для того, чтобы активировать ПО валидатора. В качестве валидатора вы будете обрабатывать транзакции и создавать блоки для общей цепочки.

Вложение своих средств и становление валидатором легче, чем [майнинг](/developers/docs/mining/) (как сеть защищена на текущий момент). И предполагается, что это помогает Ethereum быть более защищенным в долгосрочной перспективе. Чем больше людей принимают участие в работе сети, тем она становится более децентрализованной и защищенной от атак.

<InfoBanner emoji=":money_bag:">
Если вы хотите стать валидатором и принять участие в защите Beacon Chain, <a href="/staking/">узнайте больше о стейкинге</a>.
</InfoBanner>

Это также важное изменение для другого обновления: [цепочек осколков](/roadmap/danksharding/).

### Настройка цепей-осколков {#setting-up-for-shard-chains}

После слияния основной сети с Beacon Chain следующее обновление добавит цепочки-осколки в сеть с доказательством владения. Эти «осколки» увеличат пропускную способность сети и улучшат скорость транзакций за счет расширения сети до 64 блокчейнов. Beacon Chain - это важный первый шаг в введении цепей-осколков, потому что они требуют вложений для защиты работы.

Однажды Beacon Chain также станет отвечать за случайное назначение стейкеров, чтобы валидировать цепочки-осколки. Это залог усложнения сговора и установления контроля над осколками цепочки со стороны стейкеров. Таким образом, это значит, что их шансы [меньше, чем 1 к триллиону](https://medium.com/@chihchengliang/minimum-committee-size-explained-67047111fa20).

## Взаимосвязь между обновлениями {#relationship-between-upgrades}

Все обновления Ethereum в некоторой степени взаимосвязаны. Поэтому резюмируем, как Beacon Chain влияет на другие улучшения.

### Основная сеть и Beacon Chain {#mainnet-and-beacon-chain}

Сначала Beacon Chain будет существовать отдельно от основной сети Ethereum, которую мы используем сегодня. Но в конечном счете они будут связаны. План состоит в том, чтобы «объединить» основную сеть с системой доказательства владения, которая контролируется и координируется с помощью Beacon Chain.

<ButtonLink to="/roadmap/merge/">
    Слияние
</ButtonLink>

### Осколки и Beacon Chain {#shards-and-beacon-chain}

Цепочки-осколки способны только на безопасный вход в экосистему Ethereum с механизмом консенсуса на основе доказательства владения. Beacon Chain вводит ставки, прокладывая путь к последующему обновлению с цепочками-осколками.

<ButtonLink to="/roadmap/danksharding/">
    Цепочки-осколки
</ButtonLink>

<Divider />

## Взаимодействие с Beacon Chain {#interact-with-beacon-chain}

<BeaconChainActions />
