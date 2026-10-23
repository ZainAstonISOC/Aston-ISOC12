This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## For the committee: editing the site

Log in at `/admin` with the committee password. From there you can change, without touching code:

- **Events** and **Jumu'ah times**
- **Committee**: names, roles, bios (the home, about, sisters and brothers pages follow automatically)
- **Flagship campaigns**: Ramadan, Discover Islam Week, Charity Week: status, dates, volunteer roles, sign-up link
- **Fundraisers**, **charity partners** and **other ways to give**
- **Weekly programme**, **halal food**, **sponsors**
- **Site banner** (a notice on every page, with an optional end date) and **headline numbers**

Saves go live straight away. Every list has an "Undo last change" button.

Checks: `npm run audit:prod` opens the key pages in a real browser and reports layout problems; `npm run links:check` tests every link on `/links`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
