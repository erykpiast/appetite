<section class="page__offer">

	<header class="page--header">
        <h2>{{ offer.template.title }}</h2>
    </header>

    <aside class="page--aside">
        <app-offer-author model="offer.author"></app-offer-author>
    </aside>

    <div class="page--content">
		<app-gallery model="offer.template.pictures"></app-gallery>

        <div class="description text-block">
        	<p>{{ offer.template.description }}</p>

        	<p>{{ i18n.offer.recipeFrom }}: <a ng-href="{{ offer.template.recipe.url }}">{{ offer.template.recipe.domain }}</a>
            </p>
        </div>
    </div>

</section>