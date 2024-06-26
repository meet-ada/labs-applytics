<h3 align="center">
  Applytics 📊
</h3>

<p align="center">
  A simple and easy-to-use library to fetch app details and reviews from the Apple App Store and Google Play Store.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@ada-labs/applytics"><img src="https://img.shields.io/npm/dt/@ada-labs/applytics.svg" alt="Total Downloads"></a>
  <a href="https://www.npmjs.com/package/@ada-labs/applytics"><img src="https://img.shields.io/npm/v/@ada-labs/applytics.svg" alt="Latest Release"></a>
   <a href="https://github.com/meet-ada/labs-applytics/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@ada-labs/applytics.svg" alt="License"></a>
</p>

## Installation

```sh
pnpm add @ada-labs/applytics
```

## Usage

**Apple App Store**:

```ts
import { Applytics } from '@ada-labs/applytics';

const applytics = new Applytics();

applytics.appStore.get('284882215').then(console.log)
```


**Google Play Store**:

```ts
import { Applytics } from '@ada-labs/applytics';

const applytics = new Applytics();

applytics.playStore.get('com.facebook.katana').then(console.log)
```

### Methods

#### `get(appId: string): Promise<Application>`
#### `reviews(appId: string): Promise<Application>`