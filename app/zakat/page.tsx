import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import PageShell from "@/components/layout/PageShell";
import ZakatCalculator from "@/components/ui/ZakatCalculator";

export const metadata: Metadata = {
  title: "Zakat Calculator",
  description: "Calculate your Zakat quickly and accurately across gold, silver, cash, investments, business assets and liabilities, with the standard 2.5% rate.",
};

export default function ZakatPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Zakat Calculator" }]} />
      <PageHeader label="Tools" title="Zakat Calculator"
        subtitle="Work out your Zakat across cash, gold, silver, investments, and business assets, minus liabilities, at the standard 2.5% rate." />
      <ZakatCalculator />
    </PageShell>
  );
}
