# alternate-icons

Capacitor plugin that changes the app icon

## Install

```bash
npm install alternate-icons
npx cap sync
```

## API

<docgen-index>

* [`changeIcon(...)`](#changeicon)
* [`resetIcon(...)`](#reseticon)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### changeIcon(...)

```typescript
changeIcon(options: { alias: string; aliases: string[]; }) => Promise<void>
```

| Param         | Type                                               |
| ------------- | -------------------------------------------------- |
| **`options`** | <code>{ alias: string; aliases: string[]; }</code> |

--------------------


### resetIcon(...)

```typescript
resetIcon(options: { defaultAlias?: string; aliases: string[]; }) => Promise<void>
```

| Param         | Type                                                       |
| ------------- | ---------------------------------------------------------- |
| **`options`** | <code>{ defaultAlias?: string; aliases: string[]; }</code> |

--------------------

</docgen-api>
