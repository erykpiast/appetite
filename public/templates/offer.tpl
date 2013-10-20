<section class="page__part__offer grid">

	<header class="page__part__header">
        <h2>{{ offer.template.title }}</h2>
    </header>

    <div class="page__part__content four-fifths">
		<app-gallery model="offer.template.pictures"></app-gallery>

        <div class="description text-block">
        	<p>{{ offer.template.description }}</p>

        	<p>{{ i18n.offer.recipeFrom }}: <a ng-href="{{ offer.template.recipe.url }}">{{ offer.template.recipe.domain }}</a>
            </p>
        </div>
    </div>

    <aside class="page__part__aside one-fifth">
        <app-offer-author model="offer.author"></app-offer-author>
    </aside>

</section>