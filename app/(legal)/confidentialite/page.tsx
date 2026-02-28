import Link from "next/link"

export const metadata = {
  title: "Politique de confidentialité — AutoPerf Pro",
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Retour à l&apos;accueil</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Politique de confidentialité</h1>
          <p className="text-gray-500 mt-2">Dernière mise à jour : février 2026</p>
        </div>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900">Données collectées</h2>
          <p>
            Dans le cadre de l&apos;utilisation de la plateforme AutoPerf Pro, nous collectons les données suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Données d&apos;identification : nom, prénom, adresse email professionnelle</li>
            <li>Données professionnelles : rôle, concession, équipe</li>
            <li>Données de performance : fiches de marge, commissions, ventes</li>
            <li>Données techniques : adresse IP, type de navigateur, données de connexion</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Finalité du traitement</h2>
          <p>Les données sont traitées pour :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>La gestion des comptes utilisateurs et l&apos;authentification</li>
            <li>Le calcul des marges et commissions</li>
            <li>Le suivi de la performance commerciale</li>
            <li>L&apos;envoi de notifications (email et push, selon vos préférences)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Base légale</h2>
          <p>
            Le traitement est fondé sur l&apos;exécution du contrat de travail et l&apos;intérêt légitime
            de l&apos;employeur dans le suivi de la performance commerciale.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Durée de conservation</h2>
          <p>
            Les données sont conservées pendant la durée de la relation contractuelle et jusqu&apos;à 3 ans
            après la désactivation du compte pour les besoins d&apos;archivage.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression,
            de portabilité et d&apos;opposition. Pour exercer ces droits, contactez-nous à :
            <strong> dpo@autoperf.fr</strong>.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Hébergement des données</h2>
          <p>
            Les données sont hébergées par Supabase (base de données) et Vercel (application).
            Des mesures de sécurité appropriées sont mises en place (chiffrement, contrôle d&apos;accès, RLS).
          </p>
        </section>
      </div>
    </div>
  )
}
