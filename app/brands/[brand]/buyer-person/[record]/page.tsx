import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import {
  getBrandAgentRecord,
  type BuyerPersonRecord,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug } from "@/lib/data";
import { getDashboardTranslator } from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
    record: string;
  }>;
};

export default async function BuyerPersonDetailPage({ params }: Props) {
  const { brand: brandSlug, record: recordId } = await params;
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const record = getBrandAgentRecord(
    brand.slug,
    "buyer-person",
    recordId,
  ) as BuyerPersonRecord | null;

  if (!record) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="w-full space-y-6">
        <div className="sticky top-4 z-20 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/buyer-person`}
                className="admin-button-secondary admin-button-icon"
                aria-label="Volver a buyer person"
                title="Volver a buyer person"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {brand.name}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {record.profileName}
                </h1>
              </div>
            </div>

            <Link
              href={`/admin/brands/${brand.slug}/buyer-person/${record.id}/edit`}
              className="admin-button-primary"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          </div>
        </div>

        <article className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-8 p-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside>
              {record.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={record.profileImage}
                  alt={record.profileName}
                  className="aspect-square w-full rounded-2xl border border-slate-200 object-cover shadow-sm dark:border-slate-800"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  Sin imagen
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <InfoRow label="Status" value={record.status} />
                <InfoRow label="Stage" value={record.stage} />
                <InfoRow label="Priority" value={String(record.priority)} />
                <InfoRow
                  label="Conversion"
                  value={`${record.scoring.conversionLikelihood || 0}%`}
                />
                <InfoRow label="Urgency" value={record.scoring.urgency} />
                <InfoRow
                  label="Sales readiness"
                  value={record.scoring.salesReadiness}
                />
              </div>
            </aside>

            <section>
              {record.description ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t("buyerPersonDetail.descriptionTitle")}
                  </h2>
                  <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    {record.description}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 grid gap-5 xl:grid-cols-2">
                <Section title="Demographics">
                  <InfoRow label="Age range" value={record.demographics.ageRange} />
                  <InfoRow label="Gender" value={record.demographics.gender} />
                  <InfoRow label="Education" value={record.demographics.educationLevel} />
                  <InfoRow label="Employment" value={record.demographics.employmentStatus} />
                  <InfoRow label="Income" value={record.demographics.incomeRange} />
                  <InfoRow label="Family" value={record.demographics.familySituation} />
                  <List label="Location" items={record.demographics.location} />
                  <List
                    label="Language"
                    items={record.demographics.languagePreference}
                  />
                </Section>

                <Section title="Psychographics">
                  <List
                    label="Traits"
                    items={record.psychographics.personalityTraits}
                  />
                  <List label="Values" items={record.psychographics.values} />
                  <List
                    label="Interests"
                    items={record.psychographics.interests}
                  />
                </Section>

                <Section title="Goals">
                  <List label="Primary" items={record.goals.primary} />
                  <List label="Secondary" items={record.goals.secondary} />
                  <InfoRow
                    label="Success definition"
                    value={record.goals.successDefinition}
                  />
                </Section>

                <Section title="Decision Drivers">
                  <List label="Pain points" items={record.painPoints} />
                  <List label="Motivations" items={record.motivations} />
                  <List label="Objections" items={record.objections} />
                  <List
                    label="Decision factors"
                    items={record.decisionFactors}
                  />
                </Section>

                <Section title="Buyer Journey">
                  <InfoRow label="Stage" value={record.buyerJourney.stage} />
                  <List
                    label="Awareness triggers"
                    items={record.buyerJourney.awarenessTriggers}
                  />
                  <List
                    label="Information needs"
                    items={record.buyerJourney.informationNeeds}
                  />
                </Section>

                <Section title="Search Behavior">
                  <List label="Keywords" items={record.searchBehavior.keywords} />
                  <List
                    label="Questions"
                    items={record.searchBehavior.commonQuestions}
                  />
                  <List
                    label="Emotional triggers"
                    items={record.emotionalTriggers}
                  />
                </Section>

                <Section title="Communication">
                  <List
                    label="Channels"
                    items={record.preferredCommunication.channels}
                  />
                  <List
                    label="Contact time"
                    items={record.preferredCommunication.preferredContactTime}
                  />
                  <List label="Tone" items={record.preferredCommunication.tone} />
                </Section>

                <Section title="Messaging">
                  <List
                    label="Key messages"
                    items={record.messagingRecommendations.keyMessages}
                  />
                  <List
                    label="CTA examples"
                    items={record.messagingRecommendations.ctaExamples}
                  />
                  <List
                    label="Content formats"
                    items={record.contentPreferences.formats}
                  />
                </Section>

                <Section title="Metadata">
                  <InfoRow label="Created" value={record.metadata.createdAt} />
                  <InfoRow label="Updated" value={record.metadata.updatedAt} />
                  <InfoRow label="Source" value={record.metadata.source} />
                  <List label="Tags" items={record.metadata.tags} />
                </Section>
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function List({ label, items }: { label: string; items?: string[] }) {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];

  if (values.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <ul className="mt-2 space-y-2">
        {values.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
