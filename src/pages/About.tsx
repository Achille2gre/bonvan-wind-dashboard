import AppShell from "@/components/layout/AppShell";

import retroBonvan1 from "@/assets/retro-bonvan-1.jpeg";
import retroBonvan2 from "@/assets/retro-bonvan-2.png";

export default function About() {
  return (
    <AppShell showBottomNav>
      <div className="p-4">
        <h1 className="text-xl font-semibold">À propos de Bonvan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bonvan, c’est l’éolien à portée de main.
        </p>

        {/* Intro */}
        <div className="mt-4 rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chez Bonvan, nous créons des éoliennes d’autoconsommation en kit, pensées pour produire
            localement, simplement et durablement dans un contexte où l’énergie devient 
            plus chère et l’indépendance plus stratégique.
          </p>
        </div>

        {/* Image 1 */}
        <figure className="mt-3 rounded-2xl border bg-card p-4">
          <img
            src={retroBonvan1}
            alt="Deux membres de l’équipe posent près d’un prototype d’éolienne, à côté d’un kakémono Bonvan."
            className="w-full rounded-xl border object-cover"
            loading="lazy"
          />
          <figcaption className="mt-3 text-xs text-muted-foreground">
            Un prototype Bonvan, prêt à passer du labo au terrain.
          </figcaption>
        </figure>

        {/* Histoire */}
        <div className="mt-3 rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            L’histoire a commencé dans l’atelier, au plus près du réel : prototyper, tester,
            corriger, recommencer. Très vite, on a compris une chose : pour que l’éolien
            devienne vraiment accessible, il faut arrêter de le traiter comme un chantier
            et le concevoir comme un produit. Un système robuste, pilotable, sécurisé
            qui s’installe sans complexité inutile et qui s’intègre dans la vie quotidienne.
          </p>
        </div>

        {/* Image 2 */}
        <figure className="mt-3 rounded-2xl border bg-card p-4">
          <img
            src={retroBonvan2}
            alt="Quatre personnes discutent dans un atelier devant une armoire électrique et des câbles de test."
            className="w-full rounded-xl border object-cover"
            loading="lazy"
          />
          <figcaption className="mt-3 text-xs text-muted-foreground">
            Derrière la simplicité d’usage : de la R&amp;D, des tests et beaucoup d’ingénierie.
          </figcaption>
        </figure>

        {/* Ambition */}
        <div className="mt-3 rounded-2xl border bg-card p-5 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aujourd’hui, Bonvan construit une solution qui complète le solaire et redonne
            de la marge de manœuvre aux foyers et aux professionnels en le permettant de produire une part
            concrète de sa consommation, lisser sa dépendance au réseau, gagner en
            résilience. Notre ambition est claire : devenir un acteur majeur de
            l’autoconsommation en Europe et déployer des milliers d’éoliennes là où elles
            ont le plus d’impact.
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Parce qu’au fond, la transition énergétique ne se jouera pas seulement dans les
            grands projets. Elle se jouera partout. Et maintenant.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
