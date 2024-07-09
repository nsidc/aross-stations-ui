# Troubleshooting

## Warnings on `npm install`

```
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do
not use it. Check out lru-cache if you want a good and tested way to coalesce async
requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema
instead
npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array
instead
```

These are dependencies of eslint v8. See: <https://github.com/vitejs/vite/issues/17306>

When [eslint-typescript](https://github.com/typescript-eslint/typescript-eslint) v8 is
released, we can probably fix this? Until then, upgrading to eslint v9 isn't really
viable, IMO. It sounds like eslint v9 has lots of breaking changes and the ecosystem
isn't adapted yet.
