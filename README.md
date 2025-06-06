# Next.js Coveo SSR Commerce (Training Project)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

> **Note:** This project is for training purposes.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/coveo-labs/enablement_headless_ssr_commerce.git
cd enablement_headless_ssr_commerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the project

```bash
npm run build
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the application for production.
- `npm run start` – Start the production server.
- `npm run lint` – Run ESLint.
- `npm run format` – Format code using Prettier.

## Tasks / TODOs

- [ ] Replace placeholder values (`organizationId`, `accessToken`, `trackingId`) in [`lib/commerce-engine-config.ts`](lib/commerce-engine-config.ts) with real credentials.
- [ ] Review and update the commerce engine configuration as needed for your use case.
- [ ] Implement the recommendations engine definition and provider in [`components/providers/providers.tsx`](components/providers/providers.tsx).
- [ ] Add a recommendation carousel to the homepage.
- [ ] Implement the listing engine definition and provider in [`components/providers/providers.tsx`](components/providers/providers.tsx).
- [ ] Create a new page at [`app/listing`](app/listing) to display product listings.
- [ ] Implement additional features or controllers as required for your training objectives.

> Check the code for further TODO comments and update this list as you progress.
