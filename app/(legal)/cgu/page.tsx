import Link from "next/link"

export const metadata = {
  title: "Conditions générales d'utilisation — AutoPerf Pro",
}

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Retour à l&apos;accueil</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Conditions générales d&apos;utilisation</h1>
          <p className="text-gray-500 mt-2">Dernière mise à jour : février 2026</p>
        </div>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900">Objet</h2>
          <p>
            Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès et l&apos;utilisation
            de la plateforme AutoPerf Pro, outil de gestion de performance commerciale automobile.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Accès à la plateforme</h2>
          <p>
            L&apos;accès à AutoPerf Pro est réservé aux collaborateurs des concessions automobiles partenaires.
            Chaque utilisateur reçoit un compte personnel avec un rôle défini (commercial, chef des ventes,
            direction concession, direction marque, direction plaque, administrateur).
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Obligations de l&apos;utilisateur</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maintenir la confidentialité de ses identifiants de connexion</li>
            <li>Saisir des informations exactes dans les fiches de marge</li>
            <li>Ne pas tenter d&apos;accéder à des fonctionnalités non autorisées par son rôle</li>
            <li>Signaler toute utilisation frauduleuse de son compte</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Propriété des données</h2>
          <p>
            Les données saisies dans la plateforme (fiches de marge, rapports, configurations) restent la
            propriété de l&apos;entreprise employeuse. L&apos;éditeur n&apos;en dispose que dans le cadre
            strict de la fourniture du service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Disponibilité</h2>
          <p>
            L&apos;éditeur s&apos;engage à mettre en œuvre les moyens nécessaires pour assurer la disponibilité
            de la plateforme. Des interruptions pour maintenance peuvent survenir et seront communiquées
            à l&apos;avance dans la mesure du possible.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Limitation de responsabilité</h2>
          <p>
            L&apos;éditeur ne saurait être tenu responsable des dommages indirects résultant de l&apos;utilisation
            de la plateforme, notamment les pertes de données ou interruptions de service indépendantes de sa volonté.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Modification des CGU</h2>
          <p>
            L&apos;éditeur se réserve le droit de modifier les présentes CGU. Les utilisateurs seront informés
            de toute modification substantielle par notification dans la plateforme.
          </p>
        </section>
      </div>
    </div>
  )
}
