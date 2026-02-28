import Link from "next/link"

export const metadata = {
  title: "Mentions légales — AutoPerf Pro",
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Retour à l&apos;accueil</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Mentions légales</h1>
        </div>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900">Éditeur du site</h2>
          <p>
            AutoPerf Pro est édité par <strong>[Nom de la société]</strong>, société [forme juridique]
            au capital de [montant] euros, immatriculée au RCS de [ville] sous le numéro [SIRET/SIREN].
          </p>
          <p>
            Siège social : [Adresse complète]<br />
            Directeur de la publication : [Nom du directeur]<br />
            Email : contact@autoperf.fr
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Hébergement</h2>
          <p>
            Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Baxter St, Coppell, TX 75019, États-Unis.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus (textes, images, graphismes, logo, icônes, logiciels) présents sur le site
            AutoPerf Pro est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            Toute reproduction, représentation, modification ou exploitation non autorisée est interdite.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 pt-4">Responsabilité</h2>
          <p>
            L&apos;éditeur s&apos;efforce de fournir des informations exactes et à jour, mais ne saurait être tenu
            responsable des erreurs, omissions ou des résultats obtenus suite à l&apos;utilisation de ces informations.
          </p>
        </section>
      </div>
    </div>
  )
}
